# Use the official Node.js 20 Alpine image as base
FROM node:20-alpine AS base

# Install openssl, libc6-compat, and other native dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Stage 1: Build & Dependencies
FROM base AS builder

# Copy package configurations
COPY package*.json ./

# Copy Prisma schema first so client can be generated during installation
COPY prisma ./prisma/

# Install all dependencies (including devDependencies) to generate prisma client
RUN npm ci

# Generate the Prisma client
RUN npx prisma generate

# Stage 2: Production runner
FROM base AS runner

# Set production environment
ENV NODE_ENV=production

# Copy built node_modules (which contains the generated Prisma Client)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy application source code
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose port (Backend defaults to 5000 in .env)
EXPOSE 5000

# Set entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Default command
CMD ["npm", "start"]
