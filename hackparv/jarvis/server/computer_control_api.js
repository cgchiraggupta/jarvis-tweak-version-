/**
 * Computer Control API - Executes commands on the Mac
 * This bridges the web interface with the Python operate command
 */

const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.CONTROL_PORT || 4002;

app.use(cors());
app.use(express.json());

/**
 * Execute a computer control command
 */
app.post("/execute", async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: "Command is required" });
    }

    console.log(`\n[Computer Control] Executing: "${command}"`);

    // Path to Python venv and operate command
    const projectPath = "/Users/apple/hackparv/self-operating-computer";
    const venvPython = `${projectPath}/venv/bin/python3`;
    const operateModule = `${projectPath}/operate/main.py`;

    // Build the full command
    const fullCommand = `cd ${projectPath} && ${venvPython} ${operateModule} --model=assistant --prompt="${command}"`;

    console.log(`[Computer Control] Running: ${fullCommand}`);

    // Execute the command
    exec(fullCommand, { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Computer Control] Error:`, error);
        return res.status(500).json({
          success: false,
          error: error.message,
          stderr: stderr,
        });
      }

      console.log(`[Computer Control] Success!`);
      console.log(stdout);

      res.json({
        success: true,
        output: stdout,
        stderr: stderr,
        command: command,
      });
    });
  } catch (error) {
    console.error("[Computer Control] Exception:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Computer Control API",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`\n🎮 Computer Control API running on port ${PORT}`);
  console.log(`   POST /execute - Execute computer commands`);
  console.log(`   GET  /health  - Health check\n`);
});

module.exports = app;



