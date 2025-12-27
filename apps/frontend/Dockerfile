# Build stage
FROM oven/bun:1.2 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend with API URL
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app/apps/frontend
RUN bun run build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
