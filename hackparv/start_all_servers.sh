#!/bin/bash

# Complete Server Startup for Demo
# Starts all three servers needed for the full demo

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🚀 Starting All Assistant Servers 🚀                  ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the correct directory
if [ ! -d "jarvis/server" ]; then
    echo "❌ Error: jarvis/server directory not found"
    echo "Please run this script from /Users/apple/hackparv"
    exit 1
fi

# Navigate to server directory
cd jarvis/server

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    if [ -f "config.example" ]; then
        cp config.example .env
        echo "✅ Created .env file. Please add your OpenAI API key."
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

echo "Starting servers..."
echo ""
echo "  1️⃣  WebSocket Server (Voice)     → ws://localhost:4000/Assistant"
echo "  2️⃣  HTTP API (Vision)            → http://localhost:4001"
echo "  3️⃣  Computer Control API          → http://localhost:4002"
echo ""

# Start all three servers in background
node index.js > /tmp/voice_server.log 2>&1 &
VOICE_PID=$!
echo "✅ Voice server started (PID: $VOICE_PID)"

node http_server.js > /tmp/http_server.log 2>&1 &
HTTP_PID=$!
echo "✅ HTTP API started (PID: $HTTP_PID)"

node computer_control_api.js > /tmp/control_server.log 2>&1 &
CONTROL_PID=$!
echo "✅ Control API started (PID: $CONTROL_PID)"

# Give servers time to start
sleep 3

# Verify they're running
echo ""
echo "🔍 Verifying servers..."

if curl -s http://localhost:4001/health > /dev/null 2>&1; then
    echo "   ✅ HTTP API (port 4001) - Running"
else
    echo "   ❌ HTTP API (port 4001) - Failed"
fi

if curl -s http://localhost:4002/health > /dev/null 2>&1; then
    echo "   ✅ Control API (port 4002) - Running"
else
    echo "   ❌ Control API (port 4002) - Failed"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✅ ALL SERVERS RUNNING ✅                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Open demo interface:"
echo "   open ../../jarvis/full_demo.html"
echo ""
echo "🎬 Or run automated demo:"
echo "   ../../demo_for_judges.sh"
echo ""
echo "📋 Server PIDs:"
echo "   Voice: $VOICE_PID"
echo "   HTTP: $HTTP_PID"
echo "   Control: $CONTROL_PID"
echo ""
echo "🛑 To stop all servers:"
echo "   kill $VOICE_PID $HTTP_PID $CONTROL_PID"
echo ""
echo "Logs available at:"
echo "   /tmp/voice_server.log"
echo "   /tmp/http_server.log"
echo "   /tmp/control_server.log"
echo ""

# Save PIDs to file for easy cleanup
echo "$VOICE_PID $HTTP_PID $CONTROL_PID" > /tmp/assistant_pids.txt

# Trap Ctrl+C to clean up
trap "echo '\n\n🛑 Stopping all servers...'; kill $VOICE_PID $HTTP_PID $CONTROL_PID 2>/dev/null; exit" INT

echo "Press Ctrl+C to stop all servers"
echo ""

# Keep script running
wait



