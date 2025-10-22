#!/bin/bash

echo "Starting Underfloor Heating Calculator..."
echo ""

# Start backend
echo "Starting backend..."
cd backend
java -jar target/heating-calculator-1.0.0.jar &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait a bit
sleep 2

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "================================"
echo "✅ Both servers running!"
echo "Backend:  http://localhost:8080/api"
echo "Frontend: http://localhost:3000"
echo "================================"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
