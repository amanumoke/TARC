
# ==============================================================================
# Development Dockerfile for TARCMS Express Server
# ==============================================================================

FROM node:20-alpine AS development

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY biome.json ./

# Copy package descriptors
COPY packages/shared/package*.json ./packages/shared/
COPY apps/server/package*.json ./apps/server/

# Install all dependencies
RUN npm install

# Copy source trees
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build shared package
RUN npm run build --workspace=@tarcms/shared

WORKDIR /app/apps/server

EXPOSE 5000

CMD ["npm", "run", "dev"]
