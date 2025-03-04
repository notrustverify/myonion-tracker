"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ts_1 = require("../artifacts/ts");
const deployments_1 = require("../artifacts/ts/deployments");
// Load environment variables
dotenv_1.default.config();
// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const apiUrl = process.env.API_URL;
const startEventFetching = async () => {
    const deployment = (0, deployments_1.loadDeployments)(process.env.NEXT_PUBLIC_NETWORK ?? 'testnet'); // TODO use getNetwork()
    if (!deployment.contracts?.LoanFactory) {
        throw new Error('LoanFactory contract not found');
    }
    const loanFactoryContract = ts_1.LoanFactory.at(deployment.contracts.LoanFactory.contractInstance.address);
    const eventsCount = await loanFactoryContract.getContractEventsCurrentCount();
    console.log(eventsCount);
    loanFactoryContract.subscribeAllEvents({
        pollingInterval: 0,
        messageCallback: function (message) {
            console.log(message);
            return Promise.resolve();
        },
        errorCallback: function (error, subscription) {
            console.error(`Error from contract factory:`, error);
            subscription.unsubscribe();
            return Promise.resolve();
        }
    }, eventsCount);
};
// Initialize the bot
startEventFetching();
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// Store for last seen events to avoid duplicate notifications
const dataFilePath = path_1.default.join(__dirname, 'lastEvents.json');
let lastSeenEvents = [];
// Load last seen events from file if it exists
try {
    if (fs_1.default.existsSync(dataFilePath)) {
        const data = fs_1.default.readFileSync(dataFilePath, 'utf8');
        lastSeenEvents = JSON.parse(data);
        console.log('Loaded last seen events:', lastSeenEvents.length);
    }
}
catch (error) {
    console.error('Error loading last seen events:', error);
}
// Save last seen events to file
const saveLastSeenEvents = () => {
    try {
        fs_1.default.writeFileSync(dataFilePath, JSON.stringify(lastSeenEvents));
    }
    catch (error) {
        console.error('Error saving last seen events:', error);
    }
};
// Function to fetch events from API
const fetchEvents = async () => {
    try {
        const response = await axios_1.default.get(apiUrl);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};
// Function to format event message
const formatEventMessage = (event) => {
    const date = new Date(event.timestamp).toLocaleString();
    let message = `🔔 *New ${event.type.toUpperCase()} Event*\n\n`;
    message += `*${event.title}*\n`;
    message += `${event.description}\n\n`;
    message += `🕒 ${date}\n`;
    // Add specific details based on event type
    if (event.type === 'loan') {
        message += `💰 Amount: ${event.data.amount} ${event.data.token}\n`;
        message += `⏱️ Duration: ${event.data.duration} days\n`;
        message += `🔒 Collateral: ${event.data.collateral} ${event.data.collateralToken}\n`;
    }
    else if (event.type === 'auction') {
        message += `🏷️ Starting Bid: ${event.data.startingBid} ${event.data.token}\n`;
        message += `⏱️ Ends: ${new Date(event.data.endTime).toLocaleString()}\n`;
    }
    else if (event.type === 'liquidation') {
        message += `💰 Loan Amount: ${event.data.amount} ${event.data.token}\n`;
        message += `🔒 Collateral: ${event.data.collateral} ${event.data.collateralToken}\n`;
    }
    return message;
};
// Function to send notification for new events
const checkAndNotify = async () => {
    const events = await fetchEvents();
    // Filter out events we've already seen
    const newEvents = events.filter(event => !lastSeenEvents.includes(event.id));
    if (newEvents.length > 0) {
        console.log(`Found ${newEvents.length} new events`);
        // Send notification for each new event
        for (const event of newEvents) {
            const message = formatEventMessage(event);
            try {
                await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
                console.log(`Notification sent for event ${event.id}`);
                // Add to seen events
                lastSeenEvents.push(event.id);
            }
            catch (error) {
                console.error(`Error sending notification for event ${event.id}:`, error);
            }
        }
        // Trim the lastSeenEvents array to prevent it from growing too large
        if (lastSeenEvents.length > 1000) {
            lastSeenEvents = lastSeenEvents.slice(-1000);
        }
        // Save updated last seen events
        saveLastSeenEvents();
    }
    else {
        console.log('No new events found');
    }
};
// Check for new events every minute
const checkInterval = 60 * 1000; // 1 minute
setInterval(checkAndNotify, checkInterval);
// Initial check
checkAndNotify();
// Bot commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👋 Welcome to the AlpacaFi Event Notifier Bot!\n\n` +
        `I'll notify you about new events in the AlpacaFi platform, including:\n` +
        `- New loans\n` +
        `- New auctions\n` +
        `- Liquidations\n\n` +
        `Use /help to see available commands.`);
});
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Available commands:\n\n` +
        `/start - Start the bot\n` +
        `/help - Show this help message\n` +
        `/status - Check bot status\n` +
        `/latest - Get the latest events`);
});
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `✅ Bot is running\n` +
        `🔄 Checking for new events every ${checkInterval / 1000} seconds\n` +
        `📊 Tracking ${lastSeenEvents.length} events`);
});
bot.onText(/\/latest/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🔍 Fetching latest events...');
    const events = await fetchEvents();
    if (events.length === 0) {
        bot.sendMessage(chatId, '❌ No events found');
        return;
    }
    // Get the 5 most recent events
    const latestEvents = events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    for (const event of latestEvents) {
        const message = formatEventMessage(event);
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
});
console.log('AlpacaFi Event Notifier Bot is running...');
