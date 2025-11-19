#!/bin/bash
# render-start.sh - Memory-optimized start script for Render

# Set Node.js memory limit (increased for Swagger in production)
export NODE_OPTIONS="--max-old-space-size=1536"

# Start the application
node dist/main.js
