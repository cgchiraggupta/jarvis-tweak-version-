# Self-Operating Computer + Assistant Integration

This integration bridges the **self-operating-computer** Python framework with the **Assistant** Node.js API, enabling AI-powered computer control through multimodal reasoning.

## 🎯 Overview

The integration allows you to:
- Use Assistant's AI capabilities to control your Mac desktop
- Send screen state and user commands to Assistant via HTTP
- Execute AI-generated actions (mouse clicks, keyboard input, app launches)
- Switch between different AI models seamlessly

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   User Command (Text/Voice)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           self-operating-computer (Python)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Captures screenshot of current screen            │  │
│  │  2. Encodes as base64                                │  │
│  │  3. Sends to Assistant API with objective            │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP POST
                       │ /analyze
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Assistant HTTP API (Node.js)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Receives screenshot + objective                   │  │
│  │  2. Sends to GPT-4 Vision API                        │  │
│  │  3. AI analyzes screen state                         │  │
│  │  4. Generates action instructions (JSON)             │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ JSON Response
                       │ [operations]
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           self-operating-computer (Python)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Parses action instructions                        │  │
│  │  2. Executes on Mac desktop:                         │  │
│  │     - Mouse clicks at coordinates                     │  │
│  │     - Keyboard input                                  │  │
│  │     - Hotkey combinations                             │  │
│  │  3. Captures new screenshot                           │  │
│  │  4. Repeats until objective complete                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### System Requirements
- **Operating System**: macOS (tested on macOS 10.15+)
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: 7.0 or higher

### API Keys
- **OpenAI API Key**: Required for Assistant API
  - Get one at: https://platform.openai.com/api-keys
  - Model used: `gpt-4o` (GPT-4 with vision)

## 🚀 Installation

### Step 1: Clone and Navigate to Project

```bash
cd /Users/apple/hackparv
```

### Step 2: Set Up Python Environment

```bash
# Navigate to self-operating-computer directory
cd self-operating-computer

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# For voice mode (optional)
pip install -r requirements-audio.txt
```

### Step 3: Set Up Node.js Server

```bash
# Navigate to jarvis server directory
cd ../jarvis/server

# Install dependencies
npm install

# Create .env file from template
cp config.example .env

# Edit .env and add your OpenAI API key
nano .env  # or use your preferred editor
```

**Example `.env` file:**
```env
KEY=sk-proj-your-openai-api-key-here
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
HTTP_PORT=4001
WEBSOCKET_PORT=4000
NODE_ENV=development
```

### Step 4: Grant macOS Permissions

For the self-operating-computer to control your Mac, you need to grant permissions:

1. **Screen Recording Permission**:
   - Go to: **System Settings** → **Privacy & Security** → **Screen Recording**
   - Click the **+** button
   - Add **Terminal** (or your IDE if running from there, e.g., VS Code)
   - Restart Terminal/IDE

2. **Accessibility Permission**:
   - Go to: **System Settings** → **Privacy & Security** → **Accessibility**
   - Click the **+** button
   - Add **Terminal** (or your IDE)
   - Restart Terminal/IDE

### Step 5: Test the Integration

```bash
# From project root
chmod +x test_integration.py
python3 test_integration.py
```

This will verify:
- Python dependencies are installed
- Assistant API is reachable
- API endpoints are functioning
- macOS permissions are configured

## 🎮 Usage

### Starting the Assistant API

**Option 1: Using the startup script (recommended)**
```bash
# From project root
chmod +x start_assistant.sh
./start_assistant.sh
```

**Option 2: Manual start**
```bash
cd jarvis/server

# Start both servers (WebSocket + HTTP)
node index.js & node http_server.js

# Or use npm scripts
npm run dev &      # WebSocket server (port 4000)
npm run http       # HTTP API server (port 4001)
```

You should see:
```
WebSocket server running at ws://localhost:4000/Assistant
🚀 Assistant HTTP API Server running on port 4001
```

### Running Self-Operating Computer with Assistant

Once the Assistant API is running, use the `operate` command:

```bash
# Navigate to self-operating-computer
cd self-operating-computer

# Activate virtual environment if you created one
source venv/bin/activate

# Run with Assistant model
operate --model=assistant
```

Or provide a direct command:

```bash
operate --model=assistant --prompt="open Safari and search for cats"
```

### Command-Line Options

```bash
operate --model=assistant [OPTIONS]

Options:
  -m, --model MODEL       Model to use (use "assistant" for this integration)
  --prompt PROMPT         Direct command/objective (skips interactive prompt)
  --voice                 Enable voice input mode
  --verbose               Enable verbose logging
```

## 📝 Example Commands

Here are some example commands you can try:

```bash
# Open an application
operate --model=assistant --prompt="open VS Code"

# Web browsing
operate --model=assistant --prompt="open Safari and go to github.com"

# Search
operate --model=assistant --prompt="search Google for weather in San Francisco"

# File operations
operate --model=assistant --prompt="open Finder and navigate to Documents"

# Complex tasks
operate --model=assistant --prompt="open Terminal and list all files in the current directory"
```

## 🔧 Configuration

### Environment Variables

**Python (self-operating-computer)**:
- `ASSISTANT_API_URL`: Base URL for Assistant API (default: `http://localhost:4001`)
- `OPENAI_API_KEY`: (Optional) For other models like GPT-4 direct

**Node.js (Assistant API)**:
- `KEY` or `OPENAI_API_KEY`: OpenAI API key (required)
- `HTTP_PORT`: HTTP server port (default: `4001`)
- `WEBSOCKET_PORT`: WebSocket server port (default: `4000`)
- `NODE_ENV`: Environment (`development` or `production`)

### Custom API URL

To use a different Assistant API URL:

```bash
export ASSISTANT_API_URL=http://your-server:port
operate --model=assistant --prompt="your command"
```

## 🏭 Action Format

The Assistant API returns actions in JSON format:

```json
[
  {
    "operation": "click",
    "x": 150,
    "y": 300,
    "thought": "Clicking the Safari icon to open browser"
  },
  {
    "operation": "write",
    "content": "github.com",
    "thought": "Typing the URL in the address bar"
  },
  {
    "operation": "press",
    "keys": ["return"],
    "thought": "Pressing Enter to navigate"
  },
  {
    "operation": "done",
    "summary": "Successfully opened GitHub in Safari",
    "thought": "Objective completed"
  }
]
```

### Supported Operations

1. **click**: Click at specific coordinates
   ```json
   {"operation": "click", "x": 100, "y": 200, "thought": "explanation"}
   ```

2. **write**: Type text content
   ```json
   {"operation": "write", "content": "text", "thought": "explanation"}
   ```

3. **press**: Press keyboard keys (supports shortcuts)
   ```json
   {"operation": "press", "keys": ["cmd", "space"], "thought": "explanation"}
   ```

4. **done**: Mark task as complete
   ```json
   {"operation": "done", "summary": "what was done", "thought": "explanation"}
   ```

## 🐛 Troubleshooting

### Issue: "Could not connect to Assistant API"

**Solution**:
1. Ensure the Assistant server is running:
   ```bash
   ./start_assistant.sh
   ```
2. Check if port 4001 is available:
   ```bash
   lsof -i :4001
   ```
3. Verify ASSISTANT_API_URL environment variable

### Issue: "Screen Recording permission denied"

**Solution**:
1. Go to **System Settings** → **Privacy & Security** → **Screen Recording**
2. Add Terminal or your IDE
3. Restart the application

### Issue: "Accessibility permission denied"

**Solution**:
1. Go to **System Settings** → **Privacy & Security** → **Accessibility**
2. Add Terminal or your IDE
3. Restart the application

### Issue: "Invalid API Key"

**Solution**:
1. Check your `.env` file in `jarvis/server/`
2. Ensure the OpenAI API key is correct and active
3. Verify you have GPT-4 API access

### Issue: "Module not found"

**Python**:
```bash
cd self-operating-computer
pip install -r requirements.txt
```

**Node.js**:
```bash
cd jarvis/server
npm install
```

### Issue: "AI response not valid JSON"

**Solution**:
- This is usually temporary. The integration includes retry logic.
- If persistent, check verbose logs: `operate --model=assistant --verbose`
- Verify your OpenAI API key has GPT-4 access

### Debug Mode

Enable verbose logging to see detailed information:

```bash
operate --model=assistant --verbose --prompt="your command"
```

This will show:
- Screenshot capture details
- API request/response data
- Action parsing steps
- Execution details

## 🔄 Switching Models

The self-operating-computer supports multiple AI models. To switch:

```bash
# Use Assistant (this integration)
operate --model=assistant

# Use GPT-4 directly (requires OPENAI_API_KEY)
operate --model=gpt-4-with-ocr

# Use Claude
operate --model=claude-3

# Use local Ollama
operate --model=llava
```

## 📊 API Endpoints

The Assistant HTTP API provides these endpoints:

### GET /health
Health check endpoint

**Response**:
```json
{
  "status": "ok",
  "service": "Assistant API",
  "version": "1.0.0"
}
```

### POST /analyze
Main computer vision analysis endpoint

**Request**:
```json
{
  "image": "base64_encoded_screenshot",
  "prompt": "optional prompt text",
  "objective": "user's objective",
  "format": "json"
}
```

**Response**:
```json
{
  "operations": [...],
  "raw_response": "...",
  "model": "gpt-4o",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /query
Simple text query endpoint

**Request**:
```json
{
  "prompt": "your question",
  "context": "optional context"
}
```

**Response**:
```json
{
  "response": "AI response text",
  "model": "gpt-4o",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Advanced Usage

### Custom Prompts

You can customize the system prompt in `assistant_adapter.py`:

```python
def prepare_prompt(self, objective, is_first_message=False):
    # Customize this method to change AI behavior
    ...
```

### Extending Actions

To add new action types:

1. Update `assistant_adapter.py` to parse new actions
2. Update `operate.py` to handle new operation types
3. Update Assistant API system prompt in `http_server.js`

### Batch Operations

The AI can return multiple operations in sequence:

```json
[
  {"operation": "press", "keys": ["cmd", "space"], "thought": "Open Spotlight"},
  {"operation": "write", "content": "Safari", "thought": "Type app name"},
  {"operation": "press", "keys": ["return"], "thought": "Launch app"}
]
```

## 🔒 Security Considerations

- **API Keys**: Never commit `.env` files. Use `.gitignore`.
- **Permissions**: Only grant necessary macOS permissions.
- **Network**: The Assistant API runs locally by default.
- **Rate Limits**: Be aware of OpenAI API rate limits.
- **Monitoring**: Review AI actions in verbose mode before trusting fully.

## 📚 Project Structure

```
hackparv/
├── self-operating-computer/          # Python framework
│   ├── operate/
│   │   ├── main.py                   # Entry point
│   │   ├── operate.py                # Main orchestration
│   │   ├── config.py                 # Configuration
│   │   └── models/
│   │       ├── apis.py               # Model integrations
│   │       ├── assistant_adapter.py  # ✨ NEW: Assistant integration
│   │       └── prompts.py            # System prompts
│   └── requirements.txt              # Python dependencies
│
├── jarvis/                           # Node.js Assistant API
│   └── server/
│       ├── index.js                  # WebSocket server (voice/audio)
│       ├── http_server.js            # ✨ NEW: HTTP API for vision
│       ├── actions.js                # Action handlers
│       ├── config.example            # ✨ NEW: Config template
│       └── package.json              # ✨ UPDATED: New dependencies
│
├── start_assistant.sh                # ✨ NEW: Server startup script
├── test_integration.py               # ✨ NEW: Integration tests
├── INTEGRATION_README.md             # ✨ NEW: This file
└── USAGE_GUIDE.md                    # ✨ Coming next: Usage examples
```

## 🤝 Contributing

To extend or improve this integration:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with `test_integration.py`
5. Submit a pull request

## 📄 License

This integration maintains the licenses of both parent projects:
- self-operating-computer: [MIT License]
- Assistant: [Your License]

## 🙏 Acknowledgments

- **self-operating-computer**: OthersideAI team
- **OpenAI**: GPT-4 Vision API
- **Contributors**: Open source community

## 📧 Support

For issues or questions:
1. Check the troubleshooting section above
2. Run `test_integration.py` to diagnose issues
3. Enable verbose mode for detailed logs
4. Check OpenAI API status
5. Review macOS Console app for permission errors

---

**Happy automating! 🚀**




