# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace and package files
COPY package.json package-lock.json tsconfig.base.json biome.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/dashboard/package.json ./apps/dashboard/

# Install dependencies across workspaces
RUN npm ci

# Copy shared package source and dashboard source
COPY packages/shared/ ./packages/shared/
COPY apps/dashboard/ ./apps/dashboard/

# Build shared package and dashboard
RUN npm run build --workspace=@tarcms/shared
RUN npm run build --workspace=@tarcms/dashboard

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine

COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
