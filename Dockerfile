FROM oven/bun:1.2.5-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the bot
RUN bun run bot:build

# Production stage
FROM oven/bun:1.0-slim

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Run the bot
CMD ["bun", "run", "bot:start"] 