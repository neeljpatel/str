#!/bin/bash

echo "Starting Chicago Collective Development Environment..."

# 1. Start the Python FastAPI backend in the background
echo "Booting FastAPI (Backend) on port 8000..."
cd backend
source venv/bin/activate
# Using uvicorn to boot the app
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Navigate back to root
cd ..

# 2. Start the Next.js frontend
echo "Booting Next.js (Frontend) on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Catch termination signals to elegantly close both servers
function cleanup {
  echo ""
  echo "Shutting down development servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}
trap cleanup SIGINT SIGTERM

# Wait indefinitely so the script doesn't exit until you press Ctrl+C
wait
