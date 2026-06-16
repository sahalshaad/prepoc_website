#!/bin/bash
# 1. Clean the database for a fresh test
sqlite3 prisma/dev.db "DELETE FROM Subscriber WHERE email IN ('shahallshad@gmail.com', 'sahalshaad@gmail.com');"

# 2. Start the Next.js dev server in the background
npm run dev &
SERVER_PID=$!

# 3. Wait for the server to be ready
echo "Waiting for server to start..."
while ! curl -s http://localhost:3000 > /dev/null; do
  sleep 2
done
echo "Server is up!"

# 4. Trigger the actual API route which will fire the Welcome Email!
echo "Sending POST request to /api/subscribe..."
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"sahalshaad@gmail.com"}' http://localhost:3000/api/subscribe)
echo "API Response: $RESPONSE"

# 5. Kill the server
kill $SERVER_PID
