FROM node:22-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install the application dependencies
RUN npm install

COPY . .

# Build the NestJS application
RUN npm run build

FROM node:22-slim

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/client client
COPY package*.json ./

RUN npm install --omit-dev

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]