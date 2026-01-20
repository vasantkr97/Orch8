FROM oven/bun:1 AS base
WORKDIR /app

# Prune the workspace for backend
FROM base AS pruner
COPY . .
RUN bunx turbo prune --scope=backend --docker

# Install dependencies and build
FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# Generate Prisma Client (needed for backend)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bun run db:generate

# Build the project
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bun run build --filter=backend

# Production runner
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files
# Copy the built backend
COPY --from=builder /app/apps/backend/dist ./dist
# Copy node_modules for runtime dependencies (prisma engine etc)
COPY --from=builder /app/node_modules ./node_modules
# Copy DB package for potential runtime access to schema if needed
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/prisma.config.ts ./packages/db/prisma.config.ts

USER bun
EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]
