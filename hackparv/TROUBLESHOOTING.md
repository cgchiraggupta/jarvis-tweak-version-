# Troubleshooting Guide

Quick reference for common issues and solutions.

## 🔍 Quick Diagnostics

Run the test suite to identify issues:

```bash
python3 test_integration.py
```

This will check:
- Python dependencies ✅
- Assistant API connection ✅
- API endpoints ✅
- macOS permissions ✅

## ⚡ Common Issues

### 1. "Could not connect to Assistant API"

**Symptoms**:
```
❌ Could not connect to Assistant API at http://localhost:4001
ConnectionError: [Errno 61] Connection refused
```

**Solutions**:

```bash
# Check if servers are running
curl http://localhost:4001/health

# If not running, start them
./start_assistant.sh

# Check if port is in use by another process
lsof -i :4001
lsof -i :4000

# If needed, kill the process and restart
kill -9 <PID>
./start_assistant.sh
```

---

### 2. "Screen Recording Permission Denied"

**Symptoms**:
- Black screenshots
- Screenshot capture fails
- Error: "Screen recording not allowed"

**Solutions**:

1. Open **System Settings** (System Preferences on older macOS)
2. Go to **Privacy & Security** → **Screen Recording**
3. Click the **lock** icon and authenticate
4. Click **+** button
5. Add **Terminal** (or your IDE: VS Code, PyCharm, etc.)
6. **Restart** Terminal/IDE
7. Run the command again

**macOS Ventura and later**:
- You may need to grant permission to both Terminal and Python
- Add both `/usr/bin/python3` and `/Applications/Terminal.app`

---

### 3. "Accessibility Permission Denied"

**Symptoms**:
- Clicks don't register
- Keyboard input doesn't work
- Error: "Accessibility access required"

**Solutions**:

1. Open **System Settings** → **Privacy & Security** → **Accessibility**
2. Click the **lock** icon and authenticate
3. Click **+** button
4. Add **Terminal** (or your IDE)
5. **Restart** Terminal/IDE
6. Test with: `operate --model=assistant --prompt="open Safari"`

---

### 4. "Invalid API Key" or 401 Errors

**Symptoms**:
```
Error 401: Incorrect API key provided
Invalid Authentication
```

**Solutions**:

```bash
# Check your .env file
cd jarvis/server
cat .env

# Make sure KEY or OPENAI_API_KEY is set correctly
# Format: KEY=sk-proj-...

# If missing, create from template
cp config.example .env
nano .env  # Add your API key

# Verify API key is valid
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# Restart servers
./start_assistant.sh
```

**Get an API key**:
- Go to: https://platform.openai.com/api-keys
- Create new secret key
- Copy and paste into `.env` file

---

### 5. "Module Not Found" Errors

**Python Modules**:

```bash
cd self-operating-computer

# Reinstall all dependencies
pip install --upgrade -r requirements.txt

# If using virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Test specific imports
python3 -c "import requests; print('requests OK')"
python3 -c "import PIL; print('PIL OK')"
python3 -c "import pyautogui; print('pyautogui OK')"
```

**Node.js Modules**:

```bash
cd jarvis/server

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify installation
npm list express
npm list openai
npm list ws
```

---

### 6. "Operation Timeout" or "No Response"

**Symptoms**:
- Request hangs
- Timeout after 60 seconds
- No operations returned

**Solutions**:

```bash
# Check OpenAI API status
curl https://status.openai.com/

# Test with verbose mode
operate --model=assistant --verbose --prompt="open Safari"

# Try with a simpler command
operate --model=assistant --prompt="open Finder"

# Check your network connection
ping api.openai.com

# Verify firewall isn't blocking requests
# System Settings → Network → Firewall
```

---

### 7. "AI Response Not Valid JSON"

**Symptoms**:
```
Failed to parse Assistant response as JSON
JSONDecodeError: Expecting value: line 1 column 1
```

**Solutions**:

This usually means GPT-4 returned text instead of JSON. The integration includes retry logic, but if persistent:

```bash
# Check verbose logs
operate --model=assistant --verbose --prompt="your command"

# Verify your OpenAI account has GPT-4 access
# Go to: https://platform.openai.com/account/limits

# Try clearing and restarting
rm -rf screenshots/
./start_assistant.sh

# If problem persists, use a different model
operate --model=gpt-4-with-ocr --prompt="open Safari"
```

---

### 8. Port Already in Use

**Symptoms**:
```
Error: listen EADDRINUSE: address already in use :::4001
Error: listen EADDRINUSE: address already in use :::4000
```

**Solutions**:

```bash
# Find process using the port
lsof -i :4001
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use a different port
export HTTP_PORT=4002
export WEBSOCKET_PORT=4003
./start_assistant.sh

# Update Python code to use new port
export ASSISTANT_API_URL=http://localhost:4002
```

---

### 9. "operate: command not found"

**Symptoms**:
```bash
operate --model=assistant
-bash: operate: command not found
```

**Solutions**:

```bash
# Install self-operating-computer
cd self-operating-computer
pip install -e .

# Or run directly
python3 -m operate.main --model=assistant

# Or use full path
python3 operate/main.py --model=assistant

# Verify installation
which operate
operate --help
```

---

### 10. Screenshots Are Black/Empty

**Symptoms**:
- Screenshots captured but show black screen
- `screenshots/screenshot.png` exists but is black

**Solutions**:

1. **Grant Screen Recording permission** (see #2 above)
2. **Check if external display**:
   ```python
   # Test screenshot capture
   cd self-operating-computer
   python3 -c "
   from operate.utils.screenshot import capture_screen_with_cursor
   capture_screen_with_cursor('test.png')
   print('Screenshot saved to test.png')
   "
   open test.png
   ```
3. **Try different screenshot method**:
   ```bash
   # macOS built-in screenshot
   screencapture test.png
   open test.png
   ```

---

### 11. Slow Performance

**Symptoms**:
- Takes a long time between actions
- Each step takes 30+ seconds

**Causes & Solutions**:

1. **OpenAI API latency**:
   - Normal response time: 3-10 seconds
   - Check: https://status.openai.com/

2. **Large screenshots**:
   ```python
   # Screenshots are compressed automatically
   # Check size: ls -lh screenshots/
   ```

3. **OCR processing** (if using OCR models):
   - EasyOCR can be slow on first run
   - Subsequent runs are cached and faster

4. **Network issues**:
   ```bash
   # Test API speed
   time curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

---

### 12. Actions Not Executing Correctly

**Symptoms**:
- AI suggests correct action but it doesn't work
- Clicks miss the target
- Text doesn't type properly

**Solutions**:

1. **Check screen resolution**:
   - AI returns pixel coordinates
   - Coordinates may be off if resolution changed
   - Restart and recapture screenshot

2. **Check mouse speed**:
   ```python
   import pyautogui
   # Adjust speed
   pyautogui.PAUSE = 1.0  # 1 second pause between actions
   ```

3. **Verbose mode to see coordinates**:
   ```bash
   operate --model=assistant --verbose --prompt="open Safari"
   # Check logged coordinates vs actual icon location
   ```

4. **Manual verification**:
   ```bash
   # View the screenshot AI analyzed
   open screenshots/screenshot.png
   # Check if the target is visible and at expected location
   ```

---

## 🔧 Advanced Debugging

### Enable All Logging

```bash
# Python verbose mode
operate --model=assistant --verbose --prompt="your command"

# Node.js debug mode
cd jarvis/server
DEBUG=* node http_server.js
```

### Check System Resources

```bash
# Check Python process
ps aux | grep python

# Check Node processes
ps aux | grep node

# Check memory usage
top -l 1 | grep -E "PhysMem|python|node"

# Check disk space
df -h
```

### Inspect API Requests

```bash
# Terminal 1: Start server with debug
cd jarvis/server
DEBUG=* node http_server.js

# Terminal 2: Make request and watch logs
operate --model=assistant --verbose --prompt="open Safari"
```

### Test Individual Components

```bash
# Test screenshot capture
cd self-operating-computer
python3 -c "
from operate.utils.screenshot import capture_screen_with_cursor
capture_screen_with_cursor('test.png')
"

# Test Assistant API
curl -X POST http://localhost:4001/analyze \
  -H "Content-Type: application/json" \
  -d '{"image":"test_base64","prompt":"test","objective":"test"}'

# Test PyAutoGUI
python3 -c "
import pyautogui
pyautogui.moveTo(100, 100)
print('Mouse moved successfully')
"
```

---

## 🆘 Still Having Issues?

### Diagnostic Checklist

Run through this checklist:

```bash
# 1. Test Python environment
python3 --version
pip list | grep -E "requests|PIL|pyautogui|openai"

# 2. Test Node.js environment
node --version
npm --version
cd jarvis/server && npm list

# 3. Test API connectivity
curl http://localhost:4001/health

# 4. Test OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $(grep KEY jarvis/server/.env | cut -d'=' -f2)"

# 5. Test screenshots
cd self-operating-computer
python3 -c "from operate.utils.screenshot import capture_screen_with_cursor; capture_screen_with_cursor('test.png')"
open test.png

# 6. Check permissions
# System Settings → Privacy & Security → Screen Recording
# System Settings → Privacy & Security → Accessibility

# 7. Run integration tests
python3 test_integration.py
```

### Get Detailed Logs

```bash
# Create log file
operate --model=assistant --verbose --prompt="open Safari" 2>&1 | tee operate.log

# Share log for debugging
cat operate.log
```

### Reset Everything

If all else fails, start fresh:

```bash
# Python
cd self-operating-computer
rm -rf venv screenshots/
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Node.js
cd ../jarvis/server
rm -rf node_modules package-lock.json
npm install

# Restart servers
cd ../..
./start_assistant.sh

# Test again
operate --model=assistant --prompt="open Finder"
```

---

## 📚 Additional Resources

- **Integration README**: [INTEGRATION_README.md](INTEGRATION_README.md)
- **Usage Guide**: [USAGE_GUIDE.md](USAGE_GUIDE.md)
- **Examples**: [examples/](examples/)
- **OpenAI Status**: https://status.openai.com/
- **macOS Permissions**: https://support.apple.com/guide/mac-help/control-access-screen-recording-mchld6aa7d23/mac

---

## 🐛 Found a Bug?

If you encounter a bug not listed here:

1. Run `python3 test_integration.py`
2. Collect logs with `--verbose`
3. Check if it's a known issue
4. Document steps to reproduce
5. Share with maintainers

---

**💡 Tip**: Most issues are related to permissions or API keys. Check those first!




