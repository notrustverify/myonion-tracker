import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from 'axios';
import numeral from 'numeral';

import { TokenLauncher, TokenLauncherTypes } from '../artifacts/ts';
import { loadDeployments } from '../artifacts/ts/deployments';
import { addressFromContractId, hexToString, NetworkId, number256ToBigint, number256ToNumber, Subscription, web3 } from '@alephium/web3';
import { getTokenList, findTokenFromId, Token } from './utils';
import humanizeDuration from 'humanize-duration';

// Load environment variables
dotenv.config();

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const apiUrl = process.env.API_URL;

let isRateLimited = false;
let rateLimitTimeout = 0;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY_MS = 5000; // 5 seconds initial delay

// Cache and throttling for API requests
const tokenDataCache: { [tokenId: string]: any } = {};
const apiRequestTimestamps: number[] = [];
const API_RATE_LIMIT = 5; // Max requests per time window
const API_RATE_WINDOW_MS = 1000; // Time window in milliseconds (1 second)
const MAX_API_RETRIES = 20; // Maximum number of retry attempts
const RETRY_DELAY_BASE_MS = 1000; // Base delay for exponential backoff (1 second)

const startEventFetchingTokenLauncher = async () => {
  try {
    reconnectAttempts = 0; // Reset reconnect attempts on successful start
    
    // Setup cache cleaning
    setupCacheCleaning();
    
    web3.setCurrentNodeProvider(
      process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.mainnet.alephium.org",
      undefined,
      undefined
    );
    const deployment = loadDeployments( process.env.NEXT_PUBLIC_NETWORK as NetworkId ?? 'mainnet'); // TODO use getNetwork()

    if(!deployment.contracts?.TokenLauncher) {
        throw new Error('LoanFactory contract not found');
    }
    const tokenLauncherContract = TokenLauncher.at(deployment.contracts.TokenLauncher.contractInstance.address);

    const eventsCount = process.env.DEBUG == 'true' ? 0 : await tokenLauncherContract.getContractEventsCurrentCount();
    console.log(`Starting event subscription from count: ${eventsCount}`);
    
    tokenLauncherContract.subscribeAllEvents({
        pollingInterval: 16000,
        messageCallback: function (message: TokenLauncherTypes.ChangeOwnerCommenceEvent | TokenLauncherTypes.ChangeOwnerApplyEvent | TokenLauncherTypes.MigrateCommenceEvent | TokenLauncherTypes.MigrateApplyEvent | TokenLauncherTypes.MigrateWithFieldsApplyEvent | TokenLauncherTypes.CreateTokenEvent | TokenLauncherTypes.CreateBondingCurveEvent | TokenLauncherTypes.UpdateTokenMetaEvent | TokenLauncherTypes.UpdateTokenBondingCurveEvent | TokenLauncherTypes.UpdateTokenDexPairEvent): Promise<void> {
          
          // Only process specific events
          const eventsToProcess = [ 'CreateToken', 'UpdateTokenDexPair'];
          
          if (eventsToProcess.includes(message.name)) {
            console.log(`Processing event: ${message.name}`);
            
            // Format and send Telegram message
            formatTelegramMessage(message).then(formattedMessage => {
              if (bot && chatId) {
                // Check if we're rate limited
                if (isRateLimited) {
                  console.log(`Rate limited, waiting ${rateLimitTimeout}s before sending message`);
                  setTimeout(() => {
                    // Check if we have a logo URL
                    if (formattedMessage.logoUrl) {
                      sendTelegramMessageWithImage(chatId, formattedMessage.text, formattedMessage.logoUrl, formattedMessage.tokenId);
                    } else {
                      sendTelegramMessage(chatId, formattedMessage.text, formattedMessage.tokenId);
                    }
                  }, rateLimitTimeout * 1000);
                } else {
                  // Check if we have a logo URL
                  if (formattedMessage.logoUrl) {
                    sendTelegramMessageWithImage(chatId, formattedMessage.text, formattedMessage.logoUrl, formattedMessage.tokenId);
                  } else {
                    sendTelegramMessage(chatId, formattedMessage.text, formattedMessage.tokenId);
                  }
                }
              }
            });
          } else {
            console.log(`Ignoring event: ${message.name}`);
          }
          
          return Promise.resolve();
        },
        errorCallback: function (error: any, subscription: Subscription<TokenLauncherTypes.ChangeOwnerCommenceEvent | TokenLauncherTypes.ChangeOwnerApplyEvent | TokenLauncherTypes.MigrateCommenceEvent | TokenLauncherTypes.MigrateApplyEvent | TokenLauncherTypes.MigrateWithFieldsApplyEvent | TokenLauncherTypes.CreateTokenEvent | TokenLauncherTypes.CreateBondingCurveEvent | TokenLauncherTypes.UpdateTokenMetaEvent | TokenLauncherTypes.UpdateTokenBondingCurveEvent | TokenLauncherTypes.UpdateTokenDexPairEvent>): Promise<void> | void {
            console.error(`Error from contract factory:`, error);
            subscription.unsubscribe();
            // Attempt to reconnect after an error
            handleReconnection();
            return Promise.resolve();
        }
    }, eventsCount)
  } catch (error) {
    console.error('Error in startEventFetching:', error);
    // Attempt to reconnect after an exception
    handleReconnection();
  }
}

// Function to handle reconnection with exponential backoff
const handleReconnection = () => {
  reconnectAttempts++;
  
  // Calculate delay with exponential backoff (5s, 10s, 20s, 40s, etc.)
  const delay = RECONNECT_DELAY_MS * Math.pow(2, reconnectAttempts - 1);
  const cappedDelay = Math.min(delay, 300000); // Cap at 5 minutes
  
  if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
    console.log(`Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${cappedDelay/1000} seconds...`);
    
    // Send notification about reconnection attempt
    if (bot && chatId) {
      const reconnectMessage = `⚠️ *Myonion Event Notifier Bot Alert*\n\nConnection to blockchain lost. Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} scheduled in ${cappedDelay/1000} seconds.`;
      //sendTelegramMessage(chatId, reconnectMessage, '');
      console.log(reconnectMessage);
    }
    
    setTimeout(() => {
      startEventFetchingTokenLauncher();
    }, cappedDelay);
  } else {
    console.error(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Shutting down the bot.`);
    // Exit immediately without sending a final message
    process.exit(1);
  }
}

// Initialize the bot
startEventFetchingTokenLauncher();
const bot = new TelegramBot(token!, { polling: true });

// Function to check if we should throttle API requests
function shouldThrottleApiRequest(): boolean {
  const now = Date.now();
  // Remove timestamps older than our window
  while (apiRequestTimestamps.length > 0 && apiRequestTimestamps[0] < now - API_RATE_WINDOW_MS) {
    apiRequestTimestamps.shift();
  }
  // Check if we've hit the rate limit
  return apiRequestTimestamps.length >= API_RATE_LIMIT;
}

// Function to fetch token data from Myonion API with retries
async function fetchTokenData(tokenId: string, retryCount = 0): Promise<any> {
  // Check cache first
  if (tokenDataCache[tokenId]) {
    console.log(`Using cached data for token ${tokenId}`);
    return tokenDataCache[tokenId];
  }

  // Check if we've exceeded max retries
  if (retryCount >= MAX_API_RETRIES) {
    console.error(`Maximum retry attempts (${MAX_API_RETRIES}) reached for token ${tokenId}. Giving up.`);
    return null;
  }

  // Check if we should throttle
  if (shouldThrottleApiRequest()) {
    console.log(`API throttling in effect, delaying request for token ${tokenId}`);
    // Wait for the rate limit window to pass
    await new Promise(resolve => setTimeout(resolve, API_RATE_WINDOW_MS));
    // Try again with the same retry count
    return fetchTokenData(tokenId, retryCount);
  }

  try {
    // Record this request timestamp
    apiRequestTimestamps.push(Date.now());
    
    console.log(`Fetching data for token ${tokenId} from API (attempt ${retryCount + 1}/${MAX_API_RETRIES})`);
    const response = await axios.get(`https://api.mainnet.myonion.fun/api/token/${tokenId}`);
    
    if (response.data && response.data.data) {
      // Cache the result
      tokenDataCache[tokenId] = response.data.data;
      return response.data.data;
    }
    
    console.log(`No data found for token ${tokenId}`);
    
    // If the API returned a response but no data, we'll retry
    // Calculate exponential backoff delay
    const delay = RETRY_DELAY_BASE_MS * Math.pow(2, retryCount);
    console.log(`Retrying in ${delay/1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with incremented count
    return fetchTokenData(tokenId, retryCount + 1);
  } catch (error) {
    console.error(`Error fetching token data for ${tokenId}:`);
    
    // Calculate exponential backoff delay
    const delay = RETRY_DELAY_BASE_MS * Math.pow(2, retryCount);
    console.log(`Retrying in ${delay/1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with incremented count
    return fetchTokenData(tokenId, retryCount + 1);
  }
}

// Function to clear the token data cache periodically
function setupCacheCleaning() {
  const CACHE_CLEANUP_INTERVAL_MS = 3600000; // 1 hour
  setInterval(() => {
    console.log('Clearing token data cache');
    for (const key in tokenDataCache) {
      delete tokenDataCache[key];
    }
  }, CACHE_CLEANUP_INTERVAL_MS);
}

// Function to format event message for Telegram
const formatTelegramMessage = async (event: any): Promise<{ text: string, logoUrl: string, tokenId: string }> => {
  let message = '';
  let logoUrl = '';
  let tokenId = '';
  
  try {
    // Get token list for resolving token names and symbols
    const tokenList = await getTokenList();
    
    // Common header for all events with event type emoji
    const eventEmoji = getEventEmoji(event.name);
    
    // Format based on event type
    switch (event.name) {
      case 'CreateToken': {
        message += `${eventEmoji} *New token detected!*\n\n`;
  
        tokenId = event.fields.tokenId;
        
        // Try to fetch additional token data from Myonion API
        const tokenData = await fetchTokenData(tokenId);
        
        message += `📝 *Token ID:* \`${tokenId}\`\n\n`;
        
        if (tokenData) {
          // Store logo URL if available
          if (tokenData.logo) {
            logoUrl = `https://file.myonion.fun/cdn-cgi/image/width=240,height=240,fit=crop,format=webp,quality=85/${tokenData.logo}`;
          }
          
          // Use data from API if available
          message += `🏷️ *Symbol:* ${tokenData.symbol || hexToString(event.fields.symbol) || 'Unknown'}\n`;
          message += `📋 *Name:* ${tokenData.name || hexToString(event.fields.name) || 'Unknown'}\n`;
          
          // Add additional data from API
          if (tokenData.description) {
            message += `📄 *Description:*\n${tokenData.description}\n`;
          }
          
          // Add warning flags if present
          if (tokenData.isNsfw) {
            message += `⚠️ *NSFW Content*\n`;
          }
          
          if (tokenData.isOffensive) {
            message += `⚠️ *Offensive Content*\n`;
          }
          
          if (tokenData.isBlocked) {
            message += `🚫 *Blocked Token*\n`;
          }

          if(tokenData.socials !== "") {
            message += `\n${formatSocialLinks(tokenData.socials)}\n`;
          }

        } else {
          // Fallback to event data
          message += `🏷️ *Symbol:* ${hexToString(event.fields.symbol) || 'Unknown'}\n`;
          message += `📋 *Name:* ${hexToString(event.fields.name) || 'Unknown'}\n`;
        }
        
        message += `\n👤 *Creator:* ${shortenAddress(event.fields.caller)}\n`;
        break;
      }
      
      case 'UpdateTokenBondingCurve': {
        
        tokenId = event.fields.tokenId;
        
        // Try to fetch additional token data from Myonion API
        const tokenData = await fetchTokenData(tokenId);
        
        message += `📈 *Bonding Curve Initiated*\n\n`;
        message += `📝 *Token ID:* \`${tokenId}\`\n\n`;
        
        if (tokenData) {
          // Store logo URL if available
          if (tokenData.logo) {
            logoUrl = `https://file.myonion.fun/cdn-cgi/image/width=240,height=240,fit=crop,format=webp,quality=85/${tokenData.logo}`;
          }
          
          message += `🏷️ *Symbol:* ${tokenData.symbol || 'Unknown'}\n`;
          message += `📋 *Name:* ${tokenData.name || 'Unknown'}\n`;
          message += `💰 *Total Supply:* ${humanizeNumber(tokenData.supply || 0)} ${tokenData.symbol || ''}\n`;
          
          if (tokenData.description) {
            message += `📄 *Description:* ${tokenData.description}\n`;
          }
          
          if (tokenData.bondingCurve) {
            message += `🔗 *Bonding Curve:* \`${tokenData.bondingCurve}\`\n`;
          }
          
          // Add warning flags if present
          if (tokenData.isNsfw) {
            message += `⚠️ *NSFW Content*\n`;
          }
          
          if (tokenData.isOffensive) {
            message += `⚠️ *Offensive Content*\n`;
          }
          
          if (tokenData.isBlocked) {
            message += `🚫 *Blocked Token*\n`;
          }
        }
        
        message += `👤 *Creator:* ${shortenAddress(event.fields.caller)}\n`;
        break;
      }
      
      case 'UpdateTokenDexPair': {
        tokenId = event.fields.tokenId;
        
        // Try to fetch additional token data from Myonion API
        const tokenData = await fetchTokenData(tokenId);
        
        message += `🎉 *NEW GRADUATED TOKEN!*\n\n`;
        message += `📝 *Token ID:* \`${tokenId}\`\n\n`;
        
        if (tokenData) {
          // Store logo URL if available
          if (tokenData.logo) {
            logoUrl = `https://file.myonion.fun/cdn-cgi/image/width=240,height=240,fit=crop,format=webp,quality=85/${tokenData.logo}`;
          }
          
          message += `🏷️ *Symbol:* ${tokenData.symbol || 'Unknown'}\n`;
          message += `📋 *Name:* ${tokenData.name || 'Unknown'}\n`;
          
          // Add warning flags if present
          if (tokenData.isNsfw) {
            message += `⚠️ *NSFW Content*\n`;
          }
          
          if (tokenData.isOffensive) {
            message += `⚠️ *Offensive Content*\n`;
          }
          
          if (tokenData.isBlocked) {
            message += `🚫 *Blocked Token*\n`;
          }

          if(tokenData.owner !== "") {
            message += `👤 *Creator:* ${shortenAddress(tokenData.owner)}\n`;
          }
        }
        
        break;
      }
      
      default:
        //message += `Event Details: ${JSON.stringify(event.fields)}\n`;
    }
    
    // Add contract info and footer
    //message += `\n📝 *Contract:* ${shortenAddress(addressFromContractId(event.fields.contract || event.fields.currentContract || event.fields.previousContract))}`;
    
    // Add timestamp
    //message += `\n\n🕒 *Time:* ${now}`;
    
    // Add links
    
    return { text: message, logoUrl, tokenId };
  } catch (error: any) {
    console.error('Error formatting Telegram message:', error);
    const formattedMessage = { 
      text: `🔔 *Myonion Event*\n\n*${event.name} Event Received*\n\nError formatting details: ${error.message || 'Unknown error'}\n\n${JSON.stringify(event.fields)}`,
      logoUrl: '',
      tokenId: event.fields?.tokenId || ''
    };
    console.log(formattedMessage);
    return formattedMessage;
  }
};

// Helper function to get emoji for event type
function getEventEmoji(eventName: string): string {
  switch (eventName) {
    case 'CreateToken': return '🚀';
    case 'CreateBondingCurve': return '📈';
    case 'UpdateTokenMeta': return '🔄';
    case 'UpdateTokenBondingCurve': return '📊';
    case 'UpdateTokenDexPair': return '💱';
    case 'ChangeOwnerCommence': return '👑';
    case 'ChangeOwnerApply': return '✅';
    case 'MigrateCommence': return '🔄';
    case 'MigrateApply': return '✅';
    case 'MigrateWithFieldsApply': return '✅';
    default: return '🔔';
  }
}

// Helper function to format event name in a readable way
function formatEventName(eventName: string): string {
  // Add spaces before capital letters and capitalize first letter
  const formatted = eventName.replace(/([A-Z])/g, ' $1').trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Helper function to format numbers with K, M, B, T suffixes
function humanizeNumber(num: number): string {
  if (num >= 1000000000000) {
    return numeral(num).format('0.[00]a').toUpperCase(); // T for trillion
  } else if (num >= 1000000000) {
    return numeral(num).format('0.[00]a').toUpperCase(); // B for billion
  } else if (num >= 1000000) {
    return numeral(num).format('0.[00]a').toUpperCase(); // M for million
  } else if (num >= 1000) {
    return numeral(num).format('0.[00]a').toUpperCase(); // K for thousand
  } else if (num < 0.01 && num > 0) {
    return numeral(num).format('0.[000000]'); // Show up to 6 decimal places for very small numbers
  } else {
    return numeral(num).format('0,0.[00]'); // Regular formatting with up to 2 decimal places
  }
}

// Helper functions
function shortenAddress(address: string): string {
  if (!address) return 'Unknown';
  const shortened = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  return `[${shortened}](https://explorer.alephium.org/addresses/${address})`;
}

function formatInterestRate(interest: bigint): string {
  // Convert the interest rate to a human-readable percentage
  // This would depend on how interest is stored in the contract
  return (Number(interest) / 100).toFixed(2);
}

function formatDuration(duration: bigint): string {
  return humanizeDuration(Number(duration), {largest: 2, round: true});
}

function sendTelegramMessage(chatId: string, message: string, tokenId: string) {
  // Create inline keyboard with button
  const inlineKeyboard = {
    inline_keyboard: [
      [{ text: '🔄 Trade on myonion.fun', url: `https://myonion.fun/trade?tokenId=${tokenId}` }]
    ]
  };
  
  bot.sendMessage(chatId, message, { 
    parse_mode: 'Markdown', 
    disable_web_page_preview: true,
    reply_markup: inlineKeyboard
  })
    .then(() => {
      console.log('Message sent successfully');
      isRateLimited = false;
    })
    .catch((error) => {
      console.error('Error sending message:', error.message);
      
      // Handle rate limiting
      if (error.response && error.response.parameters && error.response.parameters.retry_after) {
        const retryAfter = error.response.parameters.retry_after;
        console.log(`Rate limited. Retry after ${retryAfter} seconds`);
        isRateLimited = true;
        rateLimitTimeout = retryAfter;
      }
    });
}

// New function to send message with image
function sendTelegramMessageWithImage(chatId: string, message: string, imageUrl: string, tokenId: string) {
  // Create inline keyboard with button
  const inlineKeyboard = {
    inline_keyboard: [
      [{ text: '🔄 Trade on myonion.fun', url: `https://myonion.fun/trade?tokenId=${tokenId}` }]
    ]
  };
  
  // First try to send with image
  bot.sendPhoto(chatId, imageUrl, { 
    caption: message,
    parse_mode: 'Markdown',
    reply_markup: inlineKeyboard
  })
  .then(() => {
    console.log('Message with image sent successfully');
    isRateLimited = false;
  })
  .catch((error) => {
    console.error('Error sending message with image:', error.message);
    
    // If there's an error with the image, fall back to text-only message
    if (error.code !== 'ETELEGRAM' || !error.response?.parameters?.retry_after) {
      console.log('Falling back to text-only message');
      sendTelegramMessage(chatId, message, tokenId);
      return;
    }
    
    // Handle rate limiting
    const retryAfter = error.response.parameters.retry_after;
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    isRateLimited = true;
    rateLimitTimeout = retryAfter;
    
    // Schedule retry after the rate limit expires
    setTimeout(() => {
      sendTelegramMessageWithImage(chatId, message, imageUrl, tokenId);
    }, retryAfter * 1000);
  });
}

console.log('Myonion Event Notifier Bot is running...');

// Helper function to parse and format social media links
function formatSocialLinks(socials: string): string {
  // Start with the header
  let result = "🌐 *Socials:*\n";
  
  if (!socials || socials.trim() === '') {
    // If no socials provided, show all as not available
    result += "📌 X: Not Available\n";
    result += "📌 Discord: Not Available\n";
    result += "📌 Website: Not Available\n";
    return result;
  }

  try {
    // Create a map to track which platforms we've found
    const foundPlatforms: Record<string, string> = {};
    
    // Split by semicolons and filter out empty entries
    const links = socials.split(';').filter(link => link.trim() !== '');
    
    for (const link of links) {
      // Split each entry by colon to get platform and URL/handle
      const parts = link.split(':');
      if (parts.length >= 2) {
        const platform = parts[0].trim();
        const url = parts.slice(1).join(':').trim(); // Rejoin in case URL contains colons
        
        if (platform && url) {
          const fullUrl = url.startsWith('http') ? url : getPlatformUrl(platform, url);
          const displayName = getPlatformDisplayName(platform);
          foundPlatforms[displayName] = fullUrl;
        }
      }
    }
    
    // List of common platforms we want to always show
    const commonPlatforms = ['Twitter', 'Discord', 'Website', 'Telegram'];
    
    // Add each common platform, showing "Not Available" if not found
    for (const platform of commonPlatforms) {
      if (foundPlatforms[platform]) {
        result += `📌 ${platform}: [Link](${foundPlatforms[platform]})\n`;
      } else {
        result += `📌 ${platform}: Not Available\n`;
      }
    }
    
    // Add any other platforms that were found but aren't in our common list
    for (const [platform, url] of Object.entries(foundPlatforms)) {
      if (!commonPlatforms.includes(platform)) {
        result += `📌 ${platform}: [Link](${url})\n`;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error formatting social links:', error);
    // Return default "not available" for all platforms on error
    result += "📌 X: Not Available\n";
    result += "📌 Discord: Not Available\n";
    result += "📌 Website: Not Available\n";
    return result;
  }
}

// Helper function to get emoji for social platform
function getSocialEmoji(platform: string): string {
  const lowerPlatform = platform.toLowerCase();
  if (lowerPlatform.includes('tw') || lowerPlatform.includes('twitter') || lowerPlatform.includes('x')) return '🐦';
  if (lowerPlatform.includes('tg') || lowerPlatform.includes('telegram')) return '📱';
  if (lowerPlatform.includes('ds') || lowerPlatform.includes('discord')) return '🎮';
  if (lowerPlatform.includes('web') || lowerPlatform.includes('website')) return '🌐';
  if (lowerPlatform.includes('gh') || lowerPlatform.includes('github')) return '💻';
  if (lowerPlatform.includes('md') || lowerPlatform.includes('medium')) return '📝';
  if (lowerPlatform.includes('rd') || lowerPlatform.includes('reddit')) return '📰';
  return '🔗';
}

// Helper function to get full platform display name
function getPlatformDisplayName(platform: string): string {
  const lowerPlatform = platform.toLowerCase();
  if (lowerPlatform === 'tw') return 'Twitter';
  if (lowerPlatform === 'tg') return 'Telegram';
  if (lowerPlatform === 'ds') return 'Discord';
  if (lowerPlatform === 'web') return 'Website';
  if (lowerPlatform === 'gh') return 'GitHub';
  if (lowerPlatform === 'md') return 'Medium';
  if (lowerPlatform === 'rd') return 'Reddit';
  return platform;
}

// Helper function to get full URL for platforms that need it
function getPlatformUrl(platform: string, handle: string): string {
  const lowerPlatform = platform.toLowerCase();
  if (lowerPlatform === 'tw') return `https://x.com/${handle}`;
  if (lowerPlatform === 'tg') return `https://t.me/${handle}`;
  if (lowerPlatform === 'ds') return `https://discord.gg/${handle}`;
  return handle; // Return as is for other platforms
}
