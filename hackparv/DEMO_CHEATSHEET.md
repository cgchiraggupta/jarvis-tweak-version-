# 🎬 DEMO CHEATSHEET - Quick Reference

**Print this or keep on second screen during demo!**

---

## 🚀 **START DEMO (Before Judges)**

```bash
# Terminal 1: Start servers
cd /Users/apple/hackparv
./start_assistant.sh

# Terminal 2: Prepare
cd /Users/apple/hackparv/self-operating-computer
source venv/bin/activate
clear

# Browser: Open UI
open /Users/apple/hackparv/jarvis/dashboard.html
```

**✅ Verify**: `curl http://localhost:4001/health`

---

## 🎯 **GUARANTEED COMMANDS (Won't Fail)**

```bash
# Use these in front of judges:

operate --model=assistant --prompt="open Finder"
operate --model=assistant --prompt="open Safari"
operate --model=assistant --prompt="open Notes"
operate --model=assistant --prompt="open Calendar"
operate --model=assistant --prompt="open Terminal"
operate --model=assistant --prompt="open Mail"
```

---

## 🎪 **DEMO SEQUENCE**

### **Option 1: Automated Demo**
```bash
./demo_for_judges.sh
```
**Runs perfect sequence automatically!**

### **Option 2: Manual Demo**
```bash
# 1. Show UI in browser
open jarvis/dashboard.html

# 2. Run commands
operate --model=assistant --prompt="open Finder"
operate --model=assistant --prompt="open Safari"

# 3. Let judge choose one
operate --model=assistant --prompt="[their choice]"
```

---

## 💡 **WHAT TO SAY**

**Opening**: "I'll show you AI controlling a computer in real-time using vision."

**During**: "Watch - the AI is analyzing my screen right now... deciding what to do... executing!"

**After**: "That was GPT-4 Vision seeing my desktop and controlling it autonomously."

---

## 🆘 **IF SOMETHING FAILS**

### Restart servers:
```bash
Ctrl+C (in server terminal)
./start_assistant.sh
```

### Show backup:
```bash
cat TEST_RESULTS.md
open screenshots/screenshot.png
```

---

## 🎤 **Q&A ANSWERS**

**"How does it work?"**
→ "Screenshots → GPT-4 Vision → JSON actions → PyAutoGUI executes"

**"What can it do?"**
→ "Anything you can do: open apps, browse web, file management"

**"Is it safe?"**
→ "Yes - 10 iteration limit, human objectives only, Ctrl+C stops it"

**"Hardest part?"**
→ "Bridging Python + Node.js + GPT-4 Vision in real-time"

---

## 📊 **TECH SPECS**

- **Languages**: Python 3.13 + Node.js 16+
- **AI Model**: GPT-4 Vision (gpt-4o)
- **Control**: PyAutoGUI (macOS Accessibility API)
- **Vision**: Base64 screenshots → OpenAI API
- **Response Time**: 5-10 seconds per action

---

## 🎁 **SHOW & TELL**

**Show this during demo:**
1. ✅ Dashboard UI (browser)
2. ✅ Terminal with commands
3. ✅ Apps actually opening
4. ✅ Screenshot (what AI sees)
5. ✅ Architecture diagram (ARCHITECTURE.md)

---

## ⚡ **TERMINAL COMMANDS**

```bash
# Increase font (readable from back)
Cmd + "+"

# Clear screen
clear

# Stop command
Ctrl + C

# Health check
curl http://localhost:4001/health
```

---

## 🏆 **SUCCESS = JUDGES SEE:**

1. You type a command
2. AI analyzes screen
3. Actions execute (keyboard/mouse moves)
4. App opens
5. "Objective Complete!"

**They'll be impressed! 🎉**

---

**KEEP CALM AND DEMO ON! 🚀**



