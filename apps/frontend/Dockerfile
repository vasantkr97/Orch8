FROM oven/bun:1 AS base
WORKDIR /app

# Prune the workspace for frontend
FROM base AS pruner
COPY . .
RUN bunx turbo prune --scope=frontend --docker

# Install dependencies and build
FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# Build args
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

# Build the project
RUN bun run build --filter=frontend

# Production runner
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
