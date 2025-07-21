# Use Node.js Alpine as base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build specific app (Passed as an argument)
ARG APP
RUN npm run build -- $APP

# Install only production dependencies
RUN npm ci --only=production

# Start a new stage for production
FROM node:22-alpine

WORKDIR /app

# Create a dedicated user
RUN addgroup -g 1001 -S nestjs && adduser -S nestjs -u 1001 -G nestjs

# Set environment variables
ENV NODE_ENV=production

# Copy only necessary files for the specified service
ARG APP
COPY --from=builder /app/dist/apps/$APP ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the default port
EXPOSE 3000

# Set user permissions
USER nestjs

# Run migrations and start app
CMD ["node", "main.js"]
