# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including dev deps)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build


# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5001

CMD ["node", "dist/main.js"]
