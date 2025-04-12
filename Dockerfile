# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy package files from builder and install only production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --only=production

# Copy the build artifacts and public folder from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port your Next.js app runs on (default is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]