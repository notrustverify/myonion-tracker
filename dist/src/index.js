"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const ts_1 = require("../artifacts/ts");
const deployments_1 = require("../artifacts/ts/deployments");
const web3_1 = require("@alephium/web3");
const utils_1 = require("./utils");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
// Load environment variables
dotenv_1.default.config();
// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const apiUrl = process.env.API_URL;
let isRateLimited = false;
let rateLimitTimeout = 0;
const startEventFetching = async () => {
    web3_1.web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.mainnet.alephium.org", undefined, undefined);
    const deployment = (0, deployments_1.loadDeployments)(process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet'); // TODO use getNetwork()
    if (!deployment.contracts?.LoanFactory) {
        throw new Error('LoanFactory contract not found');
    }
    const loanFactoryContract = ts_1.LoanFactory.at(deployment.contracts.LoanFactory.contractInstance.address);
    const eventsCount = await loanFactoryContract.getContractEventsCurrentCount();
    console.log(eventsCount);
    loanFactoryContract.subscribeAllEvents({
        pollingInterval: 1000,
        messageCallback: function (message) {
            // Format and send Telegram message
            formatTelegramMessage(message).then(telegramMessage => {
                if (bot && chatId) {
                    // Check if we're rate limited
                    if (isRateLimited) {
                        console.log(`Rate limited, waiting ${rateLimitTimeout}s before sending message`);
                        setTimeout(() => {
                            sendTelegramMessage(chatId, telegramMessage);
                        }, rateLimitTimeout * 1000);
                    }
                    else {
                        sendTelegramMessage(chatId, telegramMessage);
                    }
                }
            });
            return Promise.resolve();
        },
        errorCallback: function (error, subscription) {
            console.error(`Error from contract factory:`, error);
            subscription.unsubscribe();
            return Promise.resolve();
        }
    }, 0);
};
// Initialize the bot
startEventFetching();
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// Function to format event message for Telegram
const formatTelegramMessage = async (event) => {
    const now = new Date().toLocaleString();
    let message = '';
    try {
        // Get token list for resolving token names and symbols
        const tokenList = await (0, utils_1.getTokenList)();
        // Common header for all events with event type emoji
        const eventEmoji = getEventEmoji(event.name);
        message += `${eventEmoji} *AlpacaFi ${formatEventName(event.name)}*\n\n`;
        // Format based on event type
        switch (event.name) {
            case 'NewLoan': {
                const requestedTokenId = event.fields.tokenRequested;
                const collateralTokenId = event.fields.collateralToken;
                const requestedToken = (0, utils_1.findTokenFromId)(tokenList, requestedTokenId);
                const collateralToken = (0, utils_1.findTokenFromId)(tokenList, collateralTokenId);
                const requestedTokenSymbol = requestedToken?.symbol || 'Unknown';
                const collateralTokenSymbol = collateralToken?.symbol || 'Unknown';
                const requestedAmount = (0, web3_1.number256ToNumber)(event.fields.tokenAmount, requestedToken?.decimals || 18);
                const collateralAmount = (0, web3_1.number256ToNumber)(event.fields.collateralAmount, collateralToken?.decimals || 18);
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
                }
                else {
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
                const token = (0, utils_1.findTokenFromId)(tokenList, tokenId);
                const tokenSymbol = token?.symbol || 'Unknown';
                const amount = (0, web3_1.number256ToNumber)(event.fields.amount, token?.decimals || 18);
                message += `➕ Additional collateral has been added\n\n`;
                message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
                message += `🔒 *Added:* ${formatNumber(amount)} ${tokenSymbol}\n`;
                break;
            }
            case 'RemoveCollateralLoan': {
                const tokenId = event.fields.token;
                const token = (0, utils_1.findTokenFromId)(tokenList, tokenId);
                const tokenSymbol = token?.symbol || 'Unknown';
                const amount = (0, web3_1.number256ToNumber)(event.fields.amount, token?.decimals || 18);
                message += `➖ Collateral has been partially withdrawn\n\n`;
                message += `👤 *User:* ${shortenAddress(event.fields.who)}\n`;
                message += `🔓 *Removed:* ${formatNumber(amount)} ${tokenSymbol}\n`;
                break;
            }
            case 'LoanLiquidation': {
                const tokenId = event.fields.token;
                const token = (0, utils_1.findTokenFromId)(tokenList, tokenId);
                const tokenSymbol = token?.symbol || 'Unknown';
                const startingBid = (0, web3_1.number256ToNumber)(event.fields.startingBid, token?.decimals || 18);
                message += `🔨 Liquidation auction has started\n\n`;
                message += `🏷️ *Starting Bid:* ${formatNumber(startingBid)} ${tokenSymbol}\n`;
                break;
            }
            default:
                message += `Event Details: ${JSON.stringify(event.fields)}\n`;
        }
        // Add contract info and footer
        message += `\n📝 *Contract:* ${shortenAddress(event.fields.contract)}`;
        // Add timestamp footer
        message += `\n\n🕒 *Time:* ${now}`;
        // Add links
        message += `\n\n🔗 *Links:*`;
        message += `\n• [View on AlpacaFi](https://www.alpacafi.app/loan/${event.fields.contract})`;
        message += `\n• [Explorer](https://explorer.alephium.org/addresses/${(0, web3_1.addressFromContractId)(event.fields.contract)})`;
        return message;
    }
    catch (error) {
        console.error('Error formatting Telegram message:', error);
        return `🔔 *AlpacaFi Event*\n\n*${event.name} Event Received*\n\nError formatting details: ${error.message || 'Unknown error'}\n\n🕒 *Time*: ${now}`;
    }
};
// Helper function to get emoji for event type
function getEventEmoji(eventName) {
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
function formatEventName(eventName) {
    // Add spaces before capital letters and capitalize first letter
    const formatted = eventName.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
// Helper function to format numbers with commas and limited decimal places
function formatNumber(num) {
    return num.toLocaleString(undefined, {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0
    });
}
// Helper functions
function shortenAddress(address) {
    if (!address)
        return 'Unknown';
    const shortened = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    return `[${shortened}](https://explorer.alephium.org/addresses/${address})`;
}
function bytesToHex(bytes) {
    // Convert ByteVec to hex string that can be used to look up tokens
    // This is a simplified version - you may need to adjust based on your actual data format
    return bytes.startsWith('0x') ? bytes : `0x${bytes}`;
}
function formatInterestRate(interest) {
    // Convert the interest rate to a human-readable percentage
    // This would depend on how interest is stored in the contract
    return (Number(interest) / 100).toFixed(2);
}
function formatDuration(duration) {
    return (0, humanize_duration_1.default)(Number(duration), { largest: 2, round: true });
}
function sendTelegramMessage(chatId, message) {
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
