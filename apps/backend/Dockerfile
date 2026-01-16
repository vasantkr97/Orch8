# Build stage
FROM oven/bun:1.2 AS builder

WORKDIR /app

# Copy package files for all workspaces
COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/engine/package.json ./apps/engine/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client
WORKDIR /app/packages/db
RUN bunx prisma generate

# Build backend
WORKDIR /app/apps/backend
RUN bun run build

# Production stage
FROM oven/bun:1.2-slim AS production

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema and migrations for database setup
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/packages/db/prisma.config.ts ./packages/db/

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]
