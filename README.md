# alpacafi - lending on alephium
<i> How much can you possibly know about yourself if you've never been in a fight. </i>

## P2P Lending on Alephium

AlpacaFi serves as the gateway to custom democratized lending where the borrower can specify their terms and the lender choose to agree to them.

| Loans | Description |
| ----------- | ----------- |
| No Liquidation | Upon only time exipration of loan will forfeit be available and collateral goes directly to the lender. |
| Liquidation | At any point if the collateral ratio drops below 150% and or the time expires will the collateral move to auctions where it can be instantly redeemed by lender or bid on. |

Auctions serve as the pathway to lenders and managing risk over the long term.

## Auction Options

| Option | Description |
| ----------- | ----------- |
| Bid | Place any size bid that is larger than the token bid and always larger than the token requested amount. This starts a 3 hour timer to Auction End. |
| Redeem | Lender can instantly redeem for collateral and or highestBidder can redeem after the 3 hours are up. |

## Supported Tokens

| Token | Oracle? |
| ----------- | ----------- |
| $EX | AlpacaFi |
| $APAD | AlpacaFi |
| $ABX | AlpacaFi |
| $BUILD | AlpacaFi |
| $ONION | AlpacaFi |
| $ALPH | DIA |
| $AYIN | DIA |
| $USDT | DIA |
| $USDC | DIA |

# AlpacaFi Telegram Bot

A Telegram bot that monitors AlpacaFi events on the Alephium blockchain and sends notifications to a Telegram chat.

## Features

- Monitors loan creation, acceptance, repayment, and liquidation events
- Formats messages with clear, readable information
- Includes clickable links to the Alephium explorer
- Handles rate limiting from Telegram API
- Runs in Docker for easy deployment

## Setup

### Prerequisites

- Docker and Docker Compose installed
- A Telegram bot token (get one from [@BotFather](https://t.me/botfather))
- The chat ID where you want to send notifications

### Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit the `.env` file and add your Telegram bot token and chat ID:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_telegram_chat_id_here
```

### Running with Docker

Build and start the bot:

```bash
docker-compose up -d
```

View logs:

```bash
docker-compose logs -f
```

Stop the bot:

```bash
docker-compose down
```

## Development

### Local Setup

1. Install dependencies:

```bash
npm install
```

2. Build the TypeScript code:

```bash
npm run build
```

3. Run the bot:

```bash
npm start
```

## License

MIT

