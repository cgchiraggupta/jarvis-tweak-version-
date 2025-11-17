# Self-Operating Computer + Assistant Integration

🤖 **AI-Powered Computer Control on macOS**

This project integrates two powerful open-source frameworks to enable AI-driven computer automation:
- **[self-operating-computer](https://github.com/OthersideAI/self-operating-computer)** - Python framework for multimodal computer control
- **Assistant** - Node.js conversational AI API with GPT-4 Vision

## ✨ Features

- 🖱️ **Automated Mouse Control** - AI clicks, drags, and navigates
- ⌨️ **Keyboard Automation** - Types text and executes shortcuts
- 👀 **Visual Understanding** - Analyzes screen state using GPT-4 Vision
- 🎯 **Goal-Oriented** - Completes tasks step-by-step
- 🔄 **Multi-Model Support** - Easily switch between AI providers
- 🎤 **Voice Commands** - Optional voice input support
- 🌐 **Web Automation** - Open apps, browse web, perform searches

## 🎬 Quick Start

### 1. Install & Configure (5 minutes)

```bash
# Install Python dependencies
cd self-operating-computer
pip install -r requirements.txt

# Install Node.js dependencies
cd ../jarvis/server
npm install

# Configure OpenAI API key
cp config.example .env
nano .env  # Add your OpenAI API key
```

### 2. Grant macOS Permissions

Go to **System Settings** → **Privacy & Security** and add **Terminal** to:
- Screen Recording
- Accessibility

### 3. Start the Assistant API

```bash
# From project root
./start_assistant.sh
```

### 4. Run Your First Command

```bash
cd self-operating-computer
operate --model=assistant --prompt="open Safari"
```

**📖 See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.**

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | Get started in 5 minutes |
| **[INTEGRATION_README.md](INTEGRATION_README.md)** | Complete integration documentation |
| **[USAGE_GUIDE.md](USAGE_GUIDE.md)** | Usage patterns and examples |
| **[examples/](examples/)** | Example scripts and workflows |

## 🎯 Example Commands

```bash
# Open applications
operate --model=assistant --prompt="open VS Code"
operate --model=assistant --prompt="launch Terminal"

# Web browsing
operate --model=assistant --prompt="open Safari and go to github.com"
operate --model=assistant --prompt="search Google for Python tutorials"

# File management
operate --model=assistant --prompt="open Finder and navigate to Documents"

# Complex workflows
operate --model=assistant --prompt="open Safari, search for weather, and show forecast"
```

## 🏗️ How It Works

```
User Command → Screenshot → GPT-4 Vision → Actions → Execute → Repeat
```

1. **Capture**: Takes a screenshot of your desktop
2. **Analyze**: Sends to GPT-4 Vision for analysis
3. **Plan**: AI determines next action to achieve goal
4. **Execute**: Performs mouse/keyboard actions
5. **Loop**: Repeats until objective complete

## 🛠️ Architecture

```
┌─────────────────────────────────────────────┐
│  User Input (Text/Voice/GUI)                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  self-operating-computer (Python)           │
│  • Captures screenshots                     │
│  • Sends to Assistant API                   │
│  • Executes actions                         │
└──────────────────┬──────────────────────────┘
                   │ HTTP
                   ▼
┌─────────────────────────────────────────────┐
│  Assistant API (Node.js)                    │
│  • HTTP Server (port 4001)                  │
│  • WebSocket Server (port 4000)             │
│  • GPT-4 Vision integration                 │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  OpenAI GPT-4 Vision                        │
│  • Analyzes screenshots                     │
│  • Generates action plans                   │
│  • Returns JSON instructions                │
└─────────────────────────────────────────────┘
```

## 📦 Project Structure

```
hackparv/
├── self-operating-computer/      # Python computer control framework
│   ├── operate/
│   │   ├── main.py              # Entry point
│   │   ├── operate.py           # Main orchestration
│   │   ├── config.py            # Configuration
│   │   └── models/
│   │       ├── apis.py          # Model integrations
│   │       └── assistant_adapter.py  # ✨ NEW: Assistant integration
│   └── requirements.txt
│
├── jarvis/                      # Node.js Assistant API
│   └── server/
│       ├── index.js             # WebSocket server
│       ├── http_server.js       # ✨ NEW: HTTP API
│       ├── actions.js           # Action handlers
│       └── package.json         # ✨ UPDATED: Dependencies
│
├── examples/                    # ✨ NEW: Example scripts
│   ├── example_workflows.sh     # Interactive menu
│   ├── example_api_usage.py     # Direct API usage
│   └── README.md
│
├── start_assistant.sh           # ✨ NEW: Server startup script
├── test_integration.py          # ✨ NEW: Integration tests
│
├── README.md                    # This file
├── QUICKSTART.md               # ✨ NEW: 5-minute setup guide
├── INTEGRATION_README.md       # ✨ NEW: Complete documentation
└── USAGE_GUIDE.md              # ✨ NEW: Usage patterns & examples
```

## 🔧 Configuration

### Environment Variables

**Python (self-operating-computer)**:
```bash
export ASSISTANT_API_URL=http://localhost:4001  # Optional, defaults to localhost:4001
```

**Node.js (jarvis/server/.env)**:
```env
KEY=your_openai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
HTTP_PORT=4001
WEBSOCKET_PORT=4000
```

## 🧪 Testing

Run the integration test suite:

```bash
python3 test_integration.py
```

This checks:
- ✅ Python dependencies
- ✅ Assistant API connectivity
- ✅ API endpoints
- ✅ macOS permissions

## 🎮 Command-Line Options

```bash
operate --model=assistant [OPTIONS]

Options:
  -m, --model MODEL       AI model to use (assistant, gpt-4-with-ocr, claude-3, etc.)
  --prompt PROMPT         Direct command (skips interactive prompt)
  --voice                 Enable voice input mode
  --verbose               Show detailed logs
```

## 🔄 Supported Models

Switch between AI providers easily:

```bash
# Use Assistant (this integration)
operate --model=assistant

# Use GPT-4 directly
operate --model=gpt-4-with-ocr

# Use Claude 3
operate --model=claude-3

# Use local Ollama
operate --model=llava
```

## 🚀 Advanced Usage

### Interactive Mode
```bash
operate --model=assistant
# Prompts for your command
```

### Voice Mode (requires whisper_mic)
```bash
pip install -r requirements-audio.txt
operate --model=assistant --voice
```

### Verbose Mode (debugging)
```bash
operate --model=assistant --verbose --prompt="your command"
```

### Programmatic Usage
```python
import requests
import base64

# Capture screenshot
with open('screenshot.png', 'rb') as f:
    img_base64 = base64.b64encode(f.read()).decode('utf-8')

# Call Assistant API
response = requests.post('http://localhost:4001/analyze', json={
    'image': img_base64,
    'objective': 'open Safari',
    'prompt': 'Analyze this screen and tell me what to do'
})

# Get operations
operations = response.json()['operations']
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to API | Run `./start_assistant.sh` to start servers |
| Permission denied | Grant Screen Recording + Accessibility in System Settings |
| Import errors | Run `pip install -r requirements.txt` |
| Invalid API key | Check `.env` file in `jarvis/server/` |

**📖 See [INTEGRATION_README.md](INTEGRATION_README.md#-troubleshooting) for detailed troubleshooting.**

## 📊 API Endpoints

The Assistant API provides:

- `GET /health` - Health check
- `POST /analyze` - Analyze screenshot and return actions
- `POST /query` - Simple text query

**📖 See [INTEGRATION_README.md](INTEGRATION_README.md#-api-endpoints) for API documentation.**

## 🔒 Security

- ✅ API keys stored in `.env` (gitignored)
- ✅ Local-first: Servers run on localhost
- ✅ Minimal permissions: Only Screen Recording + Accessibility
- ✅ Transparent: Verbose mode shows all actions

## 🤝 Contributing

Contributions welcome! To add features:

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test with `test_integration.py`
5. Submit pull request

## 📄 License

This integration maintains the licenses of both parent projects:
- **self-operating-computer**: MIT License
- **Assistant**: [Your License]

## 🙏 Credits

- **[OthersideAI](https://github.com/OthersideAI)** - self-operating-computer framework
- **[OpenAI](https://openai.com)** - GPT-4 Vision API
- **Open Source Community** - Various dependencies and tools

## 📧 Support

1. Check documentation in this repository
2. Run `test_integration.py` for diagnostics
3. Enable `--verbose` mode for detailed logs
4. Check [INTEGRATION_README.md](INTEGRATION_README.md) troubleshooting section

## 🎯 Use Cases

- 🧪 **Testing**: Automate UI testing workflows
- 📊 **Data Entry**: Fill forms and spreadsheets
- 🔄 **Repetitive Tasks**: Automate routine computer operations
- 🎓 **Demonstrations**: Create automated demos and tutorials
- 🔬 **Research**: Study AI-computer interaction
- ♿ **Accessibility**: Assist users with limited mobility

## 🌟 Examples in Action

Visit the [examples/](examples/) directory for ready-to-run scripts:

- **example_workflows.sh** - Interactive menu with common tasks
- **example_api_usage.py** - Direct API usage demonstrations
- **More examples** - Check examples/README.md

## 🚦 Getting Started Checklist

- [ ] Install Python dependencies (`pip install -r requirements.txt`)
- [ ] Install Node.js dependencies (`npm install` in jarvis/server)
- [ ] Configure OpenAI API key in `jarvis/server/.env`
- [ ] Grant macOS permissions (Screen Recording + Accessibility)
- [ ] Start Assistant API (`./start_assistant.sh`)
- [ ] Run test suite (`python3 test_integration.py`)
- [ ] Try first command (`operate --model=assistant --prompt="open Safari"`)
- [ ] Read full documentation ([INTEGRATION_README.md](INTEGRATION_README.md))

## 📈 What's Next?

- ✅ Basic integration working
- ✅ HTTP API for vision tasks
- ✅ Documentation and examples
- 🔜 Advanced action types (drag, scroll, etc.)
- 🔜 Error recovery and retries
- 🔜 Context persistence between sessions
- 🔜 GUI for monitoring and control
- 🔜 Pre-built workflows library

---

## 🚀 Ready to Start?

```bash
# 1. Start the servers
./start_assistant.sh

# 2. In another terminal, run your first command
cd self-operating-computer
operate --model=assistant --prompt="open Safari"

# 3. Explore examples
cd examples
./example_workflows.sh
```

**📖 For detailed setup, see [QUICKSTART.md](QUICKSTART.md)**

---

**Built with ❤️ for the AI automation community**

**Star ⭐ this repo if you find it useful!**




