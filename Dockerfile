FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json yarn.lock ./
RUN yarn

# Copy source code
COPY . .

# Build TypeScript code
RUN yarn bot:build

# Set environment variables
ENV NODE_ENV=production

# Run the bot
CMD ["node", "dist/src/index.js"] 