#!/usr/bin/env python3
"""
Integration Test Script for Assistant API
Tests the connection between self-operating-computer and Assistant API
"""

import requests
import base64
import sys
import os

def test_assistant_connection():
    """Test if the Assistant HTTP API is reachable"""
    print("🔍 Testing Assistant API connection...")
    
    url = os.getenv("ASSISTANT_API_URL", "http://localhost:4001")
    
    try:
        response = requests.get(f"{url}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Assistant API is running: {data}")
            return True
        else:
            print(f"❌ Assistant API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to Assistant API at {url}")
        print("   Make sure the server is running with: ./start_assistant.sh")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Assistant API: {e}")
        return False

def test_analyze_endpoint():
    """Test the /analyze endpoint with a dummy image"""
    print("\n🔍 Testing /analyze endpoint...")
    
    url = os.getenv("ASSISTANT_API_URL", "http://localhost:4001")
    
    # Create a small dummy image (1x1 red pixel)
    from PIL import Image
    import io
    
    img = Image.new('RGB', (100, 100), color='red')
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    payload = {
        "image": img_base64,
        "prompt": "What do you see in this image?",
        "objective": "Test the API",
        "format": "json"
    }
    
    try:
        response = requests.post(f"{url}/analyze", json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ /analyze endpoint working")
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ /analyze endpoint returned status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing /analyze endpoint: {e}")
        return False

def test_python_dependencies():
    """Test if required Python dependencies are installed"""
    print("\n🔍 Testing Python dependencies...")
    
    required = ["requests", "PIL", "pyautogui", "openai"]
    missing = []
    
    for package in required:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - NOT INSTALLED")
            missing.append(package)
    
    if missing:
        print(f"\n❌ Missing dependencies: {', '.join(missing)}")
        print("   Install with: pip install -r requirements.txt")
        return False
    
    print("✅ All Python dependencies installed")
    return True

def test_macos_permissions():
    """Check if running on macOS and provide permission guidance"""
    print("\n🔍 Checking macOS permissions...")
    
    if sys.platform != "darwin":
        print("⚠️  Not running on macOS - skipping permission checks")
        return True
    
    print("⚠️  For self-operating-computer to work on macOS, you need to grant:")
    print("   1. Screen Recording permission")
    print("   2. Accessibility permission")
    print("")
    print("   Go to: System Settings > Privacy & Security > Screen Recording")
    print("   Add: Terminal (or your IDE if running from IDE)")
    print("")
    print("   Go to: System Settings > Privacy & Security > Accessibility")
    print("   Add: Terminal (or your IDE if running from IDE)")
    print("")
    return True

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Assistant API Integration Test Suite")
    print("=" * 60)
    
    results = {
        "Python Dependencies": test_python_dependencies(),
        "Assistant API Connection": test_assistant_connection(),
        "Analyze Endpoint": test_analyze_endpoint(),
        "macOS Permissions": test_macos_permissions(),
    }
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<30} {status}")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("\n✅ All tests passed! You're ready to use the integration.")
        print("\nTry running:")
        print("  operate --model=assistant --prompt='open Safari'")
    else:
        print("\n❌ Some tests failed. Please fix the issues above.")
    
    print("=" * 60)
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())




