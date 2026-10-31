# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (clean install)
RUN npm install --ignore-scripts

# Copy source code and Prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js in production mode
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

# Install OpenSSL for Prisma SQLite engine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production --ignore-scripts && \
    npm cache clean --force

# Copy built artifacts from builder with correct ownership
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma

# Create uploads directory and set permissions
RUN mkdir -p ./public/uploads && chown -R node:node /app

# Switch to non-privileged user
USER node

# Expose Next.js port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
