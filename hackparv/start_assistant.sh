#!/bin/bash

# Startup script for Assistant API Integration
# This script starts both the WebSocket and HTTP servers for the Assistant

echo "================================================"
echo "🚀 Starting Assistant API Servers"
echo "================================================"

# Check if we're in the correct directory
if [ ! -d "jarvis/server" ]; then
    echo "❌ Error: jarvis/server directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Navigate to server directory
cd jarvis/server

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from config.example..."
    
    if [ -f "config.example" ]; then
        cp config.example .env
        echo "✅ Created .env file. Please edit it and add your OpenAI API key."
        echo "Opening .env file..."
        # Try to open with default editor
        ${EDITOR:-nano} .env
    else
        echo "❌ Error: config.example not found"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "Starting servers..."
echo "  - WebSocket Server: ws://localhost:4000/Assistant"
echo "  - HTTP API Server: http://localhost:4001"
echo ""

# Start both servers
# Using background process for WebSocket and foreground for HTTP
node index.js &
WS_PID=$!
node http_server.js &
HTTP_PID=$!

# Trap Ctrl+C to clean up both processes
trap "echo '\n\n🛑 Stopping servers...'; kill $WS_PID $HTTP_PID; exit" INT

echo "✅ Servers started successfully!"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $WS_PID $HTTP_PID




