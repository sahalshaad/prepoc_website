#!/bin/bash
echo "--- TEST 2: Frontend Validation (Invalid Emails) ---"
curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"email":"abc"}' http://localhost:3000/api/subscribe
echo " (abc)"
curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"email":"test@"}' http://localhost:3000/api/subscribe
echo " (test@)"

echo -e "\n--- TEST 3: API Endpoint (Valid Email) ---"
curl -s -X POST -H "Content-Type: application/json" -d '{"email":"shahallshad@gmail.com"}' http://localhost:3000/api/subscribe
echo ""

echo -e "\n--- TEST 4: Database Verification ---"
npx prisma studio &
PID=$!
sleep 2
kill $PID
sqlite3 dev.db "SELECT email, status, source FROM Subscriber WHERE email='shahallshad@gmail.com';"

echo -e "\n--- TEST 5: Duplicate Subscription ---"
curl -s -X POST -H "Content-Type: application/json" -d '{"email":"shahallshad@gmail.com"}' http://localhost:3000/api/subscribe
echo ""

echo -e "\n--- TEST 7: Unsubscribe Flow ---"
curl -s "http://localhost:3000/api/unsubscribe?email=shahallshad@gmail.com"
echo ""
sqlite3 dev.db "SELECT email, status FROM Subscriber WHERE email='shahallshad@gmail.com';"

echo -e "\n--- TEST 8: Resubscribe Flow ---"
curl -s -X POST -H "Content-Type: application/json" -d '{"email":"shahallshad@gmail.com"}' http://localhost:3000/api/subscribe
echo ""
sqlite3 dev.db "SELECT email, status FROM Subscriber WHERE email='shahallshad@gmail.com';"

echo -e "\n--- TEST 11: Rate Limiting ---"
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code} " -X POST -H "Content-Type: application/json" -d '{"email":"rate'$i'@gmail.com"}' http://localhost:3000/api/subscribe
done
echo ""

