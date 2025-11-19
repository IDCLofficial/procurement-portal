# Use a lightweight Node image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS project
RUN npm run build



# ---- Production image ----
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only necessary files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port Railway will use
EXPOSE 3000

# Start the server
CMD ["node", "dist/main.js"]
