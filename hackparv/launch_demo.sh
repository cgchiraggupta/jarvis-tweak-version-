#!/bin/bash

# All-in-One Demo Launcher
# Opens everything you need for the demo

clear

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🚀 LAUNCHING DEMO INTERFACE 🚀                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd /Users/apple/hackparv

# Step 1: Check if servers are running
echo "📡 Step 1: Checking Assistant API servers..."
if curl -s http://localhost:4001/health > /dev/null 2>&1; then
    echo "   ✅ Servers already running"
else
    echo "   🔄 Starting servers..."
    ./start_assistant.sh > /tmp/assistant_servers.log 2>&1 &
    sleep 5
    
    if curl -s http://localhost:4001/health > /dev/null 2>&1; then
        echo "   ✅ Servers started successfully"
    else
        echo "   ❌ Failed to start servers"
        echo "   Check /tmp/assistant_servers.log for details"
        exit 1
    fi
fi

echo ""

# Step 2: Open the demo interface
echo "🌐 Step 2: Opening demo interface in browser..."
open jarvis/demo_interface.html
sleep 2
echo "   ✅ Interface opened"

echo ""

# Step 3: Prepare terminal for commands
echo "💻 Step 3: Terminal setup..."
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                     ✅ DEMO READY! ✅                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 WHAT'S OPEN:"
echo "   ✅ Assistant API Servers (background)"
echo "   ✅ Demo Interface (browser)"
echo ""
echo "🎯 FOR JUDGES - TWO WAYS TO DEMO:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OPTION 1: VOICE DEMO (In Browser)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1. Look at the browser window that just opened"
echo "  2. Click the 🎤 microphone button"
echo "  3. Say: 'open Safari' or 'open Finder'"
echo "  4. The AI will respond with voice!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OPTION 2: BUTTON DEMO (In Browser)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1. Click any button in the 'Computer Control' panel"
echo "  2. The command will be copied to clipboard"
echo "  3. Come to THIS terminal and run it:"
echo ""
echo "     cd self-operating-computer"
echo "     source venv/bin/activate"
echo "     operate --model=assistant --prompt='open Finder'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OPTION 3: AUTOMATED PERFECT DEMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Run this for a perfect automated sequence:"
echo ""
echo "     ./demo_for_judges.sh"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🎬 QUICKEST DEMO FOR JUDGES:"
echo ""
echo "   In NEW terminal window:"
echo "   cd /Users/apple/hackparv/self-operating-computer"
echo "   source venv/bin/activate"
echo "   operate --model=assistant --prompt='open Finder'"
echo ""
echo "   (Watch it execute Cmd+Space, type Finder, press Return!)"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Press any key to continue..."
read -n 1 -s

# Open a new terminal window positioned for the demo
osascript <<EOF
tell application "Terminal"
    do script "cd /Users/apple/hackparv/self-operating-computer && source venv/bin/activate && clear && echo '🤖 Ready for commands!' && echo '' && echo 'Try: operate --model=assistant --prompt=\"open Finder\"' && echo ''"
    activate
end tell
EOF

echo ""
echo "✅ New terminal window opened - ready for demo commands!"
echo ""



