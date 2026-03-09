import subprocess
import os
import time
import sys

print("Starting RippleWealth Prototype...")

# Kill any existing backend using port 8001
os.system("kill -9 $(lsof -t -i:8001) 2>/dev/null")

print("Starting FastAPI backend...")

backend = subprocess.Popen([
    sys.executable,
    "-m",
    "uvicorn",
    "backend.main:app",
    "--reload",
    "--port",
    "8001"
])

time.sleep(3)

print("Starting Streamlit frontend...")

frontend = subprocess.Popen([
    sys.executable,
    "-m",
    "streamlit",
    "run",
    "Frontend/app.py"
])

try:
    backend.wait()
    frontend.wait()
except KeyboardInterrupt:
    print("\nStopping RippleWealth...")
    backend.terminate()
    frontend.terminate()