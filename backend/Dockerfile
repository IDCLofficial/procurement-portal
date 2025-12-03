# Use a lightweight Node image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production deps
RUN npm ci --only=production

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the NestJS project and verify dist folder exists
RUN npm run build && \
    ls -la dist/ && \
    test -f dist/main.js || (echo "Build failed: dist/main.js not found" && exit 1)



# ---- Production image ----
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only necessary files for production
COPY package*.json ./

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Verify the main.js file exists before starting
RUN test -f dist/main.js || (echo "ERROR: dist/main.js not found in production image" && exit 1)

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "dist/main.js"]
