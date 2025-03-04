"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const generateEvent = async () => {
    try {
        const response = await axios_1.default.post('http://localhost:3001/generate-event');
        console.log('New event generated:');
        console.log(JSON.stringify(response.data.event, null, 2));
    }
    catch (error) {
        console.error('Error generating event:', error);
    }
};
generateEvent();
