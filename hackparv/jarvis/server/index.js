const WebSocket = require("ws");
const http = require("http");
const helper = require("./utils/audiofunctions.js");
const actions = require("./actions.js");
require("dotenv").config();

const gptKey = process.env.KEY;
const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Client connected to /Assistant");

  const messageQueue = [];
  let gptClientReady = false;

  const url =
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
  const gptClient = new WebSocket(url, {
    headers: {
      Authorization: `Bearer ${gptKey}`,
      "OpenAI-Beta": "realtime=v1",
    },
  });

  // When connected to OpenAI
  gptClient.on("open", function open() {
    console.log("Connected to OpenAI Realtime API");
    gptClientReady = true;

    // Configure session with proper instructions
    const sessionUpdate = {
      type: "session.update",
      session: {
        instructions: `You are a helpful voice assistant that can control the user's computer.

When the user asks you to open an application (like VS Code, Chrome, Terminal, Notepad, etc.), you should:
1. Acknowledge the request
2. Call the openApp function with the application name

When the user asks you to open a website or URL (like "open google.com" or "go to youtube"), you should:
1. Acknowledge the request
2. Call the openUrl function with the URL

When the user asks you to search for something on Google (like "search for cats" or "google python tutorials"), you should:
1. Acknowledge the request
2. Call the searchGoogle function with the search query

Available actions:
- openApp: Opens an application on the user's computer
- openUrl: Opens a URL in the default browser
- searchGoogle: Searches Google for a query and opens results in Chrome

Always try to help the user open applications, websites, and search when they ask. You have the ability to do this.`,
        tools: [
          {
            type: "function",
            name: "openApp",
            description: "Opens an application on the user's computer",
            parameters: {
              type: "object",
              properties: {
                appName: {
                  type: "string",
                  description:
                    "The name of the application to open (e.g., 'vscode', 'chrome', 'terminal')",
                },
              },
              required: ["appName"],
            },
          },
          {
            type: "function",
            name: "openUrl",
            description: "Opens a URL in the default web browser",
            parameters: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description:
                    "The URL to open (e.g., 'google.com', 'https://youtube.com', 'github.com')",
                },
              },
              required: ["url"],
            },
          },
          {
            type: "function",
            name: "searchGoogle",
            description:
              "Searches Google for a query and opens the results in Chrome",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "The search query (e.g., 'best pizza near me', 'how to code in python', 'weather today')",
                },
              },
              required: ["query"],
            },
          },
        ],
        tool_choice: "auto",
      },
    };
    gptClient.send(JSON.stringify(sessionUpdate));
    console.log("Sent session configuration to GPT");

    // Send any queued messages from before connection
    while (messageQueue.length > 0) {
      const queuedMessage = messageQueue.shift();
      gptClient.send(queuedMessage);
    }

    ws.send("your gpt client is ready for u to use");
  });

  // Log and handle events from OpenAI server
  gptClient.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);

      console.log("\n================= OpenAI Event =================");
      console.log("Event Type:", parsedData.type || "unknown");

      // Only show full data for important events
      if (parsedData.type && parsedData.type.includes("function_call")) {
        console.log("Full Data:", JSON.stringify(parsedData, null, 2));
      }
      console.log("====================================================");

      // Log key info
      if (parsedData.response?.status)
        console.log("Response Status:", parsedData.response.status);
      if (parsedData.delta?.length)
        console.log("Audio Delta Length:", parsedData.delta.length);
      if (parsedData.error) console.error("Error:", parsedData.error);

      // Handle function calls from GPT
      if (parsedData.type === "response.function_call_arguments.done") {
        console.log("Function call detected:", parsedData);
        const functionName = parsedData.name;
        let args;

        try {
          args = parsedData.arguments ? JSON.parse(parsedData.arguments) : {};
          console.log("Parsed arguments:", args);
        } catch (e) {
          console.error("Failed to parse function arguments:", e);
          args = {};
        }

        console.log(`Attempting to execute function: ${functionName}`);
        console.log(`Available actions:`, Object.keys(actions));

        if (functionName === "openApp" && actions.openApp) {
          console.log("Executing openApp with:", args.appName);

          // Execute the action immediately
          try {
            const result = actions.openApp(args.appName);
            console.log("Action executed successfully:", result);

            // Send function result back to GPT
            const functionResult = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: parsedData.call_id,
                output: JSON.stringify({
                  success: true,
                  message: `Successfully opened ${args.appName}`,
                  result: result,
                }),
              },
            };
            gptClient.send(JSON.stringify(functionResult));
            console.log("Sent function result to GPT");

            // Trigger response generation
            gptClient.send(JSON.stringify({ type: "response.create" }));
            console.log("Triggered response generation");
          } catch (error) {
            console.error("Error executing openApp:", error);

            // Send error back to GPT
            const errorResult = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: parsedData.call_id,
                output: JSON.stringify({
                  success: false,
                  error: error.message,
                }),
              },
            };
            gptClient.send(JSON.stringify(errorResult));
            gptClient.send(JSON.stringify({ type: "response.create" }));
          }
        } else if (functionName === "openUrl" && actions.openUrl) {
          console.log("Executing openUrl with:", args.url);

          // Execute the action immediately
          try {
            const result = actions.openUrl(args.url);
            console.log("Action executed successfully:", result);

            // Send function result back to GPT
            const functionResult = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: parsedData.call_id,
                output: JSON.stringify({
                  success: true,
                  message: `Successfully opened ${args.url}`,
                  result: result,
                }),
              },
            };
            gptClient.send(JSON.stringify(functionResult));
            console.log("Sent function result to GPT");

            // Trigger response generation
            gptClient.send(JSON.stringify({ type: "response.create" }));
            console.log("Triggered response generation");
          } catch (error) {
            console.error("Error executing openUrl:", error);

            // Send error back to GPT
            const errorResult = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: parsedData.call_id,
                output: JSON.stringify({
                  success: false,
                  error: error.message,
                }),
              },
            };
            gptClient.send(JSON.stringify(errorResult));
            gptClient.send(JSON.stringify({ type: "response.create" }));
          }
        } else if (functionName === "searchGoogle" && actions.searchGoogle) {
          console.log("Executing searchGoogle with:", args.query);

          // Execute the action immediately
          try {
            const result = actions.searchGoogle(args.query);
            console.log("Action executed successfully:", result);

            // Send function result back to GPT
            const functionResult = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: parsedData.call_id,
                output: JSON.stringify({
                  success: true,
                  message: `Successfully searched for ${args.query}`,
                  result: result,
                }),
              },
            };
            gptClient.send(JSON.stringify(functionResult));
            console.log("Sent function result to GPT");

            // Trigger response generation
            gptClient.send(JSON.stringify({ type: "response.create" }));
            console.log("Triggered response generation");
          } catch (error) {
            console.error("Error executing searchGoogle:", error);

            // Send error back to GPT
            const errorResult = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: parsedData.call_id,
                output: JSON.stringify({
                  success: false,
                  error: error.message,
                }),
              },
            };
            gptClient.send(JSON.stringify(errorResult));
            gptClient.send(JSON.stringify({ type: "response.create" }));
          }
        } else {
          console.warn(
            `Function ${functionName} not found in actions or not available`,
          );
        }
      } else if (parsedData.type === "response.audio.delta") {
        const pcmData = helper.base64ToArrayBuffer(parsedData.delta);
        const sampleRate = 24000;
        const header = helper.createWavHeader(sampleRate, pcmData.byteLength);
        const finalAudioBuffer = helper.concatenateWavHeaderAndData(
          header,
          pcmData,
        );
        ws.send(finalAudioBuffer);
      } else {
        // Forward any other event to client for transparency
        ws.send(JSON.stringify(parsedData));
      }
    } catch (err) {
      console.error("Error parsing GPT message:", err);
      console.error("Raw data:", data.toString());
    }
  });

  // Handle GPT errors
  gptClient.on("error", (error) => {
    console.error("GPT WebSocket error:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        error: {
          message: "Connection to OpenAI failed",
          details: error.message,
        },
      }),
    );
  });

  gptClient.on("close", () => {
    console.log("GPT WebSocket closed");
    ws.close();
  });

  // When client sends data
  ws.on("message", (message) => {
    console.log("\nMessage from client:", message.toString());

    try {
      const event = JSON.parse(message);

      if (gptClientReady && gptClient.readyState === WebSocket.OPEN) {
        gptClient.send(JSON.stringify(event));
        console.log("Forwarded client message to GPT");
      } else {
        console.log("Queueing message until GPT client is ready");
        messageQueue.push(JSON.stringify(event));
      }
    } catch (e) {
      console.error("Invalid JSON from client:", e);
      ws.send(
        JSON.stringify({
          type: "error",
          error: {
            message: "Invalid JSON format sent to server.",
            details: e.message,
          },
        }),
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (gptClient.readyState === WebSocket.OPEN) gptClient.close();
  });
});

// Handle upgrade requests
server.on("upgrade", (req, socket, head) => {
  if (req.url === "/Assistant") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(4000, () => {
  console.log("WebSocket server running at ws://localhost:4000/Assistant");
});
