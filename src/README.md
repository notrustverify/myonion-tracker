# AlpacaFi Event Notifier Bot

A Telegram bot that notifies users about new events in the AlpacaFi platform, including new loans, auctions, and liquidations.

## Features

- Real-time notifications for new events
- Command-based interaction
- Persistent tracking of seen events to avoid duplicates
- Customizable check interval

## Setup

1. **Create a Telegram Bot**:
   - Talk to [@BotFather](https://t.me/botfather) on Telegram
   - Use the `/newbot` command to create a new bot
   - Copy the API token provided by BotFather

2. **Configure Environment Variables**:
   - Copy the `.env` file from the project root
   - Replace `your_telegram_bot_token_here` with the token from BotFather
   - Set `CHAT_ID` to the chat ID where you want to receive notifications
   - Update `API_URL` to point to your events API endpoint

3. **Install Dependencies**:
   ```bash
   yarn install
   ```

4. **Build and Run the Bot**:
   ```bash
   # Build the bot
   yarn bot:build
   
   # Start the bot
   yarn bot:start
   ```

## Available Commands

- `/start` - Start the bot and receive a welcome message
- `/help` - Show available commands
- `/status` - Check the bot's status
- `/latest` - Get the 5 most recent events

## Customization

You can customize the bot by modifying the following:

- **Check Interval**: Change the `checkInterval` variable in `src/index.tsx` to adjust how often the bot checks for new events (default: 1 minute)
- **Event Types**: Modify the `Event` interface to match your API's event structure
- **Message Format**: Update the `formatEventMessage` function to change how event notifications are formatted

## Deployment

For production deployment, consider using a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start the bot with PM2
pm2 start dist/index.js --name alpacafi-bot

# Make sure the bot starts on system reboot
pm2 startup
pm2 save
```

## Troubleshooting

- **Bot not responding**: Make sure the `TELEGRAM_BOT_TOKEN` is correct
- **No notifications**: Check that the `CHAT_ID` is correct and the bot has permission to send messages
- **API errors**: Verify that the `API_URL` is accessible and returns data in the expected format 