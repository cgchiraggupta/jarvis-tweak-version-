/**
 * HTTP Server for Assistant API
 * 
 * Provides REST endpoints for computer vision and control tasks,
 * complementing the WebSocket-based real-time audio interface.
 */

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.HTTP_PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Large limit for base64 images
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.KEY || process.env.OPENAI_API_KEY,
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Assistant API", version: "1.0.0" });
});

/**
 * Main analysis endpoint for computer vision tasks
 * 
 * Accepts a screenshot and prompt, returns AI-generated actions
 */
app.post("/analyze", async (req, res) => {
  try {
    const { image, prompt, objective, format = "json" } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "Missing required field: image (base64 encoded)",
      });
    }

    if (!prompt && !objective) {
      return res.status(400).json({
        error: "Missing required field: prompt or objective",
      });
    }

    console.log("\n[Assistant API] Received analysis request");
    console.log(`[Assistant API] Objective: ${objective || "Not specified"}`);
    console.log(`[Assistant API] Image size: ${image.length} bytes (base64)`);

    // Construct the system prompt for computer control
    const systemPrompt = `You are an AI assistant that helps control a computer by analyzing screenshots and providing precise instructions.

When given a screenshot and an objective, you should:
1. Analyze the current screen state carefully
2. Determine the next logical action to achieve the objective
3. Respond with a JSON array of operations

Available operations:
- click: Click at specific coordinates {"operation": "click", "x": 100, "y": 200, "thought": "clicking the button"}
- write: Type text {"operation": "write", "content": "text to type", "thought": "entering text"}
- press: Press keyboard keys {"operation": "press", "keys": ["cmd", "space"], "thought": "opening spotlight"}
- done: Mark task complete {"operation": "done", "summary": "task completed", "thought": "objective achieved"}

Coordinates should be in pixels from the top-left corner (0,0).
Always provide a "thought" field explaining your reasoning.

Respond ONLY with a valid JSON array. Example:
[{"operation": "click", "x": 150, "y": 300, "thought": "Clicking the Safari icon to open browser"}]`;

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt || `Help me achieve this objective: ${objective}`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${image}`,
            },
          },
        ],
      },
    ];

    console.log("[Assistant API] Sending request to OpenAI GPT-4 Vision...");

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    console.log(`[Assistant API] Raw response: ${responseText}`);

    // Try to extract JSON from the response
    let operations;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.substring(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.substring(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.substring(
          0,
          cleanedResponse.length - 3
        );
      }
      cleanedResponse = cleanedResponse.trim();

      operations = JSON.parse(cleanedResponse);
      
      // Ensure it's an array
      if (!Array.isArray(operations)) {
        operations = [operations];
      }

      console.log(`[Assistant API] Parsed ${operations.length} operation(s)`);
    } catch (parseError) {
      console.error("[Assistant API] Failed to parse JSON:", parseError);
      console.error("[Assistant API] Response was:", responseText);

      // Return a fallback response
      return res.json({
        operations: [
          {
            operation: "done",
            summary: "Unable to parse AI response",
            thought:
              "The AI response was not in the expected JSON format. Please try again.",
          },
        ],
        raw_response: responseText,
        error: "JSON parse failed",
      });
    }

    // Return the operations
    res.json({
      operations: operations,
      raw_response: responseText,
      model: "gpt-4o",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Assistant API] Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

/**
 * Text-only endpoint for simple queries
 */
app.post("/query", async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing required field: prompt",
      });
    }

    console.log(`\n[Assistant API] Text query: ${prompt}`);

    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant that helps control computers.",
      },
    ];

    if (context) {
      messages.push({
        role: "user",
        content: `Context: ${context}`,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    res.json({
      response: response,
      model: "gpt-4o",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Assistant API] Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n================================================`);
  console.log(`🚀 Assistant HTTP API Server running on port ${PORT}`);
  console.log(`================================================`);
  console.log(`Endpoints:`);
  console.log(`  GET  /health      - Health check`);
  console.log(`  POST /analyze     - Analyze screenshot and return actions`);
  console.log(`  POST /query       - Simple text query`);
  console.log(`================================================\n`);
});

module.exports = app;




