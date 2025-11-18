"""
Assistant API Adapter for Self-Operating Computer

This module provides an adapter to integrate the Assistant Node.js API
with the self-operating-computer framework, allowing AI-powered computer
control through the Assistant's reasoning capabilities.
"""

import base64
import json
import os
import time
import traceback
import requests
from PIL import Image

from operate.config import Config
from operate.models.prompts import get_system_prompt
from operate.utils.screenshot import capture_screen_with_cursor
from operate.utils.style import ANSI_BRIGHT_MAGENTA, ANSI_GREEN, ANSI_RED, ANSI_RESET

# Load configuration
config = Config()


class AssistantAdapter:
    """
    Adapter for communicating with the Assistant API.
    Converts screenshots and commands into Assistant-compatible format,
    and parses responses back into executable actions.
    """

    def __init__(self, base_url=None):
        """
        Initialize the Assistant adapter.

        Args:
            base_url: Base URL for the Assistant API (default: http://localhost:4001)
        """
        self.base_url = base_url or os.getenv(
            "ASSISTANT_API_URL", "http://localhost:4001"
        )
        self.session_messages = []

    def encode_screenshot(self, screenshot_path):
        """
        Encode a screenshot as base64 for transmission to Assistant.

        Args:
            screenshot_path: Path to the screenshot file

        Returns:
            Base64-encoded string of the image
        """
        with open(screenshot_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode("utf-8")

    def prepare_prompt(self, objective, is_first_message=False):
        """
        Prepare a prompt for the Assistant with context about the task.

        Args:
            objective: The user's objective/command
            is_first_message: Whether this is the first message in the session

        Returns:
            Formatted prompt string
        """
        if is_first_message:
            return f"""I need you to help me control a computer to achieve this objective: {objective}

You can respond with JSON commands to control the computer. Available operations:

1. CLICK - Click at a specific location
   {{"operation": "click", "x": <x_coordinate>, "y": <y_coordinate>, "thought": "explanation"}}

2. TYPE - Type text content
   {{"operation": "write", "content": "text to type", "thought": "explanation"}}

3. PRESS - Press keyboard key(s) or shortcuts
   {{"operation": "press", "keys": ["key1", "key2"], "thought": "explanation"}}

4. DONE - Mark objective as complete
   {{"operation": "done", "summary": "what was accomplished", "thought": "explanation"}}

Please analyze the current screen state and tell me what action to take next. Respond ONLY with a JSON array of operations."""
        else:
            return "Based on the current screen state, what should I do next? Respond with a JSON array of operations."

    def call_assistant_api(self, screenshot_base64, prompt, objective):
        """
        Call the Assistant API with screenshot and prompt.

        Args:
            screenshot_base64: Base64-encoded screenshot
            prompt: Text prompt for the Assistant
            objective: The overall user objective

        Returns:
            JSON response from Assistant
        """
        try:
            payload = {
                "image": screenshot_base64,
                "prompt": prompt,
                "objective": objective,
                "format": "json",
            }

            if config.verbose:
                print(f"[AssistantAdapter] Calling API at {self.base_url}/analyze")

            response = requests.post(
                f"{self.base_url}/analyze",
                json=payload,
                timeout=60,  # 60 second timeout
            )

            response.raise_for_status()
            return response.json()

        except requests.exceptions.ConnectionError:
            raise Exception(
                f"Could not connect to Assistant API at {self.base_url}. "
                "Make sure the Assistant server is running on port 4001."
            )
        except requests.exceptions.Timeout:
            raise Exception("Request to Assistant API timed out.")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error calling Assistant API: {str(e)}")

    def parse_response(self, response):
        """
        Parse the Assistant's response into executable operations.

        Args:
            response: Raw response from Assistant API

        Returns:
            List of operation dictionaries
        """
        try:
            # Extract the operations from the response
            if isinstance(response, dict):
                if "operations" in response:
                    operations = response["operations"]
                elif "actions" in response:
                    operations = response["actions"]
                elif "response" in response:
                    # Try to parse the response field as JSON
                    operations = json.loads(response["response"])
                else:
                    # Assume the whole response is the operations
                    operations = [response]
            elif isinstance(response, list):
                operations = response
            elif isinstance(response, str):
                # Try to parse as JSON
                operations = json.loads(response)
            else:
                raise ValueError(f"Unexpected response format: {type(response)}")

            # Ensure operations is a list
            if not isinstance(operations, list):
                operations = [operations]

            # Validate each operation
            validated_operations = []
            for op in operations:
                if not isinstance(op, dict):
                    continue

                operation_type = op.get("operation", "").lower()
                
                if operation_type in ["click", "press", "write", "done"]:
                    # Ensure required fields exist
                    if operation_type == "click":
                        if "x" not in op or "y" not in op:
                            continue
                    elif operation_type == "write":
                        if "content" not in op:
                            continue
                    elif operation_type == "press":
                        if "keys" not in op:
                            continue
                    elif operation_type == "done":
                        if "summary" not in op:
                            op["summary"] = "Task completed"
                    
                    # Ensure thought field exists
                    if "thought" not in op:
                        op["thought"] = f"Performing {operation_type} operation"
                    
                    validated_operations.append(op)

            return validated_operations

        except json.JSONDecodeError as e:
            if config.verbose:
                print(f"[AssistantAdapter] JSON decode error: {e}")
                print(f"[AssistantAdapter] Response was: {response}")
            raise Exception(f"Failed to parse Assistant response as JSON: {str(e)}")
        except Exception as e:
            if config.verbose:
                print(f"[AssistantAdapter] Error parsing response: {e}")
                traceback.print_exc()
            raise Exception(f"Failed to parse Assistant response: {str(e)}")


async def call_assistant_with_vision(messages, objective, model):
    """
    Main function to call the Assistant API with vision capabilities.

    This function captures a screenshot, sends it to the Assistant API along
    with the user's objective, and returns parsed operations.

    Args:
        messages: Message history (for consistency with other model APIs)
        objective: The user's objective/command
        model: Model name (should be 'assistant')

    Returns:
        List of operations to execute
    """
    if config.verbose:
        print("[call_assistant_with_vision]")

    try:
        time.sleep(1)

        # Initialize the adapter
        adapter = AssistantAdapter()

        # Create screenshots directory
        screenshots_dir = "screenshots"
        if not os.path.exists(screenshots_dir):
            os.makedirs(screenshots_dir)

        # Capture screenshot
        screenshot_filename = os.path.join(screenshots_dir, "screenshot.png")
        capture_screen_with_cursor(screenshot_filename)

        # Encode screenshot
        screenshot_base64 = adapter.encode_screenshot(screenshot_filename)

        # Determine if this is the first message
        is_first_message = len(messages) == 1

        # Prepare prompt
        prompt = adapter.prepare_prompt(objective, is_first_message)

        if config.verbose:
            print(f"[call_assistant_with_vision] Sending request to Assistant")
            print(f"[call_assistant_with_vision] Objective: {objective}")

        # Call Assistant API
        response = adapter.call_assistant_api(screenshot_base64, prompt, objective)

        if config.verbose:
            print(f"[call_assistant_with_vision] Received response: {response}")

        # Parse response into operations
        operations = adapter.parse_response(response)

        if config.verbose:
            print(f"[call_assistant_with_vision] Parsed operations: {operations}")

        # Add to message history
        assistant_message = {
            "role": "assistant",
            "content": json.dumps(operations),
        }
        messages.append(assistant_message)

        return operations

    except Exception as e:
        print(
            f"{ANSI_GREEN}[Self-Operating Computer]{ANSI_BRIGHT_MAGENTA}[{model}] "
            f"Assistant call failed: {ANSI_RESET}{str(e)}"
        )
        if config.verbose:
            print("[Self-Operating Computer][Operate] error", e)
            traceback.print_exc()
        
        # Re-raise to let the main loop handle it
        raise




