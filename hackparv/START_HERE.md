# 🎬 START HERE - Demo for Judges

## 🚀 ONE-COMMAND LAUNCH

**Run this from `/Users/apple/hackparv` directory:**

```bash
cd /Users/apple/hackparv
./launch_demo.sh
```

**This will:**
1. ✅ Start Assistant API servers
2. ✅ Open beautiful demo interface in browser
3. ✅ Open terminal ready for commands

---

## 🎯 THREE DEMO OPTIONS

### **Option 1: VOICE DEMO** 🎤 (Most Impressive!)

**In the browser window:**

1. Click the big **🎤 microphone button**
2. **Speak**: "Open Safari" or "Open Finder"
3. AI responds with **voice**!
4. Shows you have voice + computer control

**Judges will see:**
- You talking to computer
- AI responding with voice
- Beautiful visualizer showing audio

---

### **Option 2: BUTTON DEMO** 🖱️ (Easiest!)

**In the browser:**

1. Click any button:
   - 📁 Open Finder
   - 🌐 Open Safari
   - 📝 Open Notes

2. Command copies to clipboard

3. In terminal, paste and run:
```bash
cd /Users/apple/hackparv/self-operating-computer
source venv/bin/activate
operate --model=assistant --prompt="open Finder"
```

4. **Watch the magic happen!**

---

### **Option 3: AUTOMATED DEMO** 🎬 (Safest!)

**In terminal:**

```bash
cd /Users/apple/hackparv
./demo_for_judges.sh
```

Runs 3 perfect demos automatically!

---

## 📱 WHERE TO FIND EVERYTHING

**All commands must run from:** `/Users/apple/hackparv`

```bash
# Always start here:
cd /Users/apple/hackparv

# Then run:
./launch_demo.sh        # One-command launch
./demo_for_judges.sh    # Automated demo
```

**Interfaces:**
- `jarvis/demo_interface.html` - **Main demo UI** ⭐
- `jarvis/index2.html` - Original voice interface
- `jarvis/dashboard.html` - Computer control dashboard

---

## 🎪 RECOMMENDED DEMO FLOW

### **Before Judges Arrive:**

```bash
cd /Users/apple/hackparv
./launch_demo.sh
```

### **When Judges Are Watching:**

**Show the browser interface** (should be open automatically)

**Say**: "I'll demonstrate AI controlling a computer using voice and vision."

**Demo 1**: Click the **🎤 button**, say "Open Safari"
- They hear you speak
- AI responds with voice  
- Safari opens!

**Demo 2**: Click **📁 Open Finder** button in browser
- Then run command in terminal
- They see it execute step-by-step

**Demo 3**: Ask a judge what to open
- Type their request
- Execute and watch!

---

## ✅ GUARANTEED COMMANDS (Won't Fail)

```bash
operate --model=assistant --prompt="open Finder"
operate --model=assistant --prompt="open Safari"
operate --model=assistant --prompt="open Notes"
operate --model=assistant --prompt="open Calendar"
```

---

## 🆘 IF YOU'RE CONFUSED

**Just run this:**

```bash
cd /Users/apple/hackparv
./launch_demo.sh
```

**Then look at the browser window that opens!**

---

## 📋 CHEAT SHEET

**From `/Users/apple/hackparv`:**

| Command | What It Does |
|---------|-------------|
| `./launch_demo.sh` | Opens everything (UI + servers) |
| `./demo_for_judges.sh` | Runs automated perfect demo |
| `open jarvis/demo_interface.html` | Open just the UI |
| `./start_assistant.sh` | Start just the servers |

**From `/Users/apple/hackparv/self-operating-computer` with venv:**

| Command | What It Does |
|---------|-------------|
| `operate --model=assistant --prompt="open Finder"` | Execute command |
| `operate --model=assistant` | Interactive mode |
| `operate --model=assistant --verbose --prompt="..."` | Show details |

---

## 🎊 YOU HAVE:

✅ **Voice Interface** - Talk to AI, it talks back  
✅ **Visual Interface** - Beautiful web UI  
✅ **Computer Control** - AI actually opens apps  
✅ **Live Demo** - Works in real-time  
✅ **Backup Options** - Multiple demo methods  

---

**RUN THIS NOW:**

```bash
cd /Users/apple/hackparv
./launch_demo.sh
```

**Then show judges the browser window! 🎬**



