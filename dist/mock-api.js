"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const app = (0, express_1.default)();
const PORT = 3001;
// Sample event data
const eventTypes = ['loan', 'auction', 'liquidation'];
const tokens = ['ALPH', 'USDT', 'USDC', 'AYIN', 'EX', 'APAD', 'ABX', 'BUILD', 'ONION'];
const titles = [
    'New Loan Created',
    'Auction Started',
    'Loan Liquidated',
    'Collateral Auction',
    'Loan Repaid Early',
    'Large Position Opened',
    'Significant Price Movement'
];
// Store for generated events
let events = [];
// Generate a random event
const generateRandomEvent = () => {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const collateralToken = tokens[Math.floor(Math.random() * tokens.length)];
    const baseEvent = {
        id: (0, crypto_1.randomUUID)(),
        type,
        title,
        description: `This is a ${type} event for ${token}`,
        timestamp: Date.now(),
    };
    let data = {};
    if (type === 'loan') {
        data = {
            amount: (Math.random() * 1000).toFixed(2),
            token,
            duration: Math.floor(Math.random() * 30) + 1,
            collateral: (Math.random() * 2000).toFixed(2),
            collateralToken
        };
    }
    else if (type === 'auction') {
        data = {
            startingBid: (Math.random() * 500).toFixed(2),
            token,
            endTime: Date.now() + (Math.random() * 86400000 * 3) // Up to 3 days in the future
        };
    }
    else if (type === 'liquidation') {
        data = {
            amount: (Math.random() * 1000).toFixed(2),
            token,
            collateral: (Math.random() * 2000).toFixed(2),
            collateralToken
        };
    }
    return {
        ...baseEvent,
        data
    };
};
// Generate initial events
for (let i = 0; i < 10; i++) {
    events.push(generateRandomEvent());
}
// API endpoint to get events
app.get('/events', (req, res) => {
    res.json(events);
});
// Endpoint to generate a new event
app.post('/generate-event', (req, res) => {
    const newEvent = generateRandomEvent();
    events.unshift(newEvent); // Add to the beginning of the array
    // Keep only the latest 100 events
    if (events.length > 100) {
        events = events.slice(0, 100);
    }
    res.json({ success: true, event: newEvent });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Mock API server running at http://localhost:${PORT}`);
    console.log(`- GET /events - Get all events`);
    console.log(`- POST /generate-event - Generate a new random event`);
});
