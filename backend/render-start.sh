#!/bin/bash
# render-start.sh - Memory-optimized start script for Render

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=1024"

# Start the application
node dist/main.js
