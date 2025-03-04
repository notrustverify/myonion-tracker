import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { LoanFactory, LoanFactoryTypes } from '../artifacts/ts';
import { loadDeployments } from '../artifacts/ts/deployments';
import { addressFromContractId, NetworkId, number256ToBigint, number256ToNumber, Subscription, web3 } from '@alephium/web3';
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

const startEventFetching = async () => {
  try {
    reconnectAttempts = 0; // Reset reconnect attempts on successful start
    
    web3.setCurrentNodeProvider(
      process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.mainnet.alephium.org",
      undefined,
      undefined
    );
    const deployment = loadDeployments( process.env.NEXT_PUBLIC_NETWORK as NetworkId ?? 'mainnet'); // TODO use getNetwork()

    if(!deployment.contracts?.LoanFactory) {
        throw new Error('LoanFactory contract not found');
    }

    const loanFactoryContract = LoanFactory.at(deployment.contracts.LoanFactory.contractInstance.address);

    const eventsCount = await loanFactoryContract.getContractEventsCurrentCount();
    console.log(`Starting event subscription from count: ${eventsCount}`);
    
    loanFactoryContract.subscribeAllEvents({
        pollingInterval: 16000,
        messageCallback: function (message: LoanFactoryTypes.NewLoanEvent | LoanFactoryTypes.AcceptedLoanEvent | LoanFactoryTypes.LoanRemovedEvent | LoanFactoryTypes.LoanCanceledEvent | LoanFactoryTypes.LoanLiqWithEvent | LoanFactoryTypes.LoanPayedEvent | LoanFactoryTypes.AddCollateralLoanEvent | LoanFactoryTypes.RemoveCollateralLoanEvent | LoanFactoryTypes.LoanLiquidationEvent): Promise<void> {
              // Format and send Telegram message
              formatTelegramMessage(message).then(telegramMessage => {
                if (bot && chatId) {
                  // Check if we're rate limited
                  if (isRateLimited) {
                    console.log(`Rate limited, waiting ${rateLimitTimeout}s before sending message`);
                    setTimeout(() => {
                      sendTelegramMessage(chatId, telegramMessage);
                    }, rateLimitTimeout * 1000);
                  } else {
                    sendTelegramMessage(chatId, telegramMessage);
                  }
                }
              });
            
            return Promise.resolve();
        },
        errorCallback: function (error: any, subscription: Subscription<LoanFactoryTypes.NewLoanEvent | LoanFactoryTypes.AcceptedLoanEvent | LoanFactoryTypes.LoanRemovedEvent | LoanFactoryTypes.LoanCanceledEvent | LoanFactoryTypes.LoanLiqWithEvent | LoanFactoryTypes.LoanPayedEvent | LoanFactoryTypes.AddCollateralLoanEvent | LoanFactoryTypes.RemoveCollateralLoanEvent | LoanFactoryTypes.LoanLiquidationEvent>): Promise<void> | void {
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
      const reconnectMessage = `⚠️ *AlpacaFi Bot Alert*\n\nConnection to blockchain lost. Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} scheduled in ${cappedDelay/1000} seconds.`;
      sendTelegramMessage(chatId, reconnectMessage);
    }
    
    setTimeout(() => {
      startEventFetching();
    }, cappedDelay);
  } else {
    console.error(`Maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Shutting down the bot.`);
    // Exit immediately without sending a final message
    process.exit(1);
  }
}

// Initialize the bot
startEventFetching();
const bot = new TelegramBot(token!, { polling: true });

// Function to format event message for Telegram
const formatTelegramMessage = async (event: any): Promise<string> => {
  const now = new Date().toLocaleString();
  let message = '';
  
  try {
    // Get token list for resolving token names and symbols
    const tokenList = await getTokenList();
    
    // Common header for all events with event type emoji
    const eventEmoji = getEventEmoji(event.name);
    message += `${eventEmoji} *AlpacaFi ${formatEventName(event.name)}*\n\n`;
    
    // Format based on event type
    switch (event.name) {
      case 'NewLoan': {
        const requestedTokenId = event.fields.tokenRequested;
        const collateralTokenId = event.fields.collateralToken;
        
        const requestedToken = findTokenFromId(tokenList, requestedTokenId);
        const collateralToken = findTokenFromId(tokenList, collateralTokenId);
        
        const requestedTokenSymbol = requestedToken?.symbol || 'Unknown';
        const collateralTokenSymbol = collateralToken?.symbol || 'Unknown';
        
        const requestedAmount = number256ToNumber(event.fields.tokenAmount, requestedToken?.decimals || 18);
        const collateralAmount = number256ToNumber(event.fields.collateralAmount, collateralToken?.decimals || 18);
        
        message += `💰 *Loan Amount:* ${formatNumber(requestedAmount)} ${requestedTokenSymbol}\n`;
        message += `🔒 *Collateral:* ${formatNumber(collateralAmount)} ${collateralTokenSymbol}\n`;
        message += `💹 *Interest Rate:* ${formatInterestRate(event.fields.interest)}%\n`;
        message += `⏱️ *Duration:* ${formatDuration(event.fields.duration)}\n`;
        message += `👤 *Borrower:* ${shortenAddress(event.fields.who)}\n`;
        break;
      }
      
      case 'AcceptedLoan':
        message += `✅ Loan has been accepted and funded\n\n`;
        message += `👤 *Lender:* ${shortenAddress(event.fields.who)}\n`;
        break;
      
      case 'LoanRemoved':
        message += `🗑️ Loan has been removed from the platform\n\n`;
        message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
        break;
      
      case 'LoanCanceled':
        message += `❌ Loan has been canceled by the borrower\n\n`;
        message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
        break;
      
      case 'LoanLiqWith':
        if (event.fields.liquidation) {
          message += `⚠️ Loan is being liquidated\n\n`;
        } else {
          message += `💸 Funds have been withdrawn from the loan\n\n`;
        }
        message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
        break;
      
      case 'LoanPayed':
        message += `✅ Loan has been fully repaid\n\n`;
        message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
        break;
      
      case 'AddCollateralLoan': {
        const tokenId = event.fields.token;
        const token = findTokenFromId(tokenList, tokenId);
        const tokenSymbol = token?.symbol || 'Unknown';
        const amount = number256ToNumber(event.fields.amount, token?.decimals || 18);
        
        message += `➕ Additional collateral has been added\n\n`;
        message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
        message += `🔒 *Added:* ${formatNumber(amount)} ${tokenSymbol}\n`;
        break;
      }
      
      case 'RemoveCollateralLoan': {
        const tokenId = event.fields.token;
        const token = findTokenFromId(tokenList, tokenId);
        const tokenSymbol = token?.symbol || 'Unknown';
        const amount = number256ToNumber(event.fields.amount, token?.decimals || 18);
        
        message += `➖ Collateral has been partially withdrawn\n\n`;
        message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
        message += `🔓 *Removed:* ${formatNumber(amount)} ${tokenSymbol}\n`;
        break;
      }
      
      case 'LoanLiquidation': {
        const tokenId = event.fields.token;
        const token = findTokenFromId(tokenList, tokenId);
        const tokenSymbol = token?.symbol || 'Unknown';
        const startingBid = number256ToNumber(event.fields.startingBid, token?.decimals || 18);
        
        message += `🔨 Liquidation auction has started\n\n`;
        message += `🏷️ *Starting Bid:* ${formatNumber(startingBid)} ${tokenSymbol}\n`;
        break;
      }
      
      default:
        message += `Event Details: ${JSON.stringify(event.fields)}\n`;
    }
    
    // Add contract info and footer
    message += `\n📝 *Contract:* ${shortenAddress(event.fields.contract)}`;
    
    // Add links
    message += `\n\n🔗 *Links:*`;
    message += `\n• [View on AlpacaFi](https://www.alpacafi.app/loan/${event.fields.contract})`;
    message += `\n• [Explorer](https://explorer.alephium.org/addresses/${addressFromContractId(event.fields.contract)})`;
    
    return message;
  } catch (error: any) {
    console.error('Error formatting Telegram message:', error);
    return `🔔 *AlpacaFi Event*\n\n*${event.name} Event Received*\n\nError formatting details: ${error.message || 'Unknown error'}\n\n🕒 *Time*: ${now}`;
  }
};

// Helper function to get emoji for event type
function getEventEmoji(eventName: string): string {
  switch (eventName) {
    case 'NewLoan': return '🆕';
    case 'AcceptedLoan': return '✅';
    case 'LoanRemoved': return '🗑️';
    case 'LoanCanceled': return '❌';
    case 'LoanLiqWith': return '💸';
    case 'LoanPayed': return '💰';
    case 'AddCollateralLoan': return '➕';
    case 'RemoveCollateralLoan': return '➖';
    case 'LoanLiquidation': return '🔨';
    default: return '🔔';
  }
}

// Helper function to format event name in a readable way
function formatEventName(eventName: string): string {
  // Add spaces before capital letters and capitalize first letter
  const formatted = eventName.replace(/([A-Z])/g, ' $1').trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Helper function to format numbers with commas and limited decimal places
function formatNumber(num: number): string {
  return num.toLocaleString(undefined, { 
    maximumFractionDigits: 6,
    minimumFractionDigits: 0
  });
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

function sendTelegramMessage(chatId: string, message: string) {
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true })
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

console.log('AlpacaFi Event Notifier Bot is running...');
