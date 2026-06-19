#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4541/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== RentDeck Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@uludagkayak.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/renters" -H "Authorization: Bearer $TOKEN")
assert_status "List Renters" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/tune-jobs" -H "Authorization: Bearer $TOKEN")
assert_status "List Tune Jobs" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rentals" -H "Authorization: Bearer $TOKEN")
assert_status "List Rentals" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rental-packages" -H "Authorization: Bearer $TOKEN")
assert_status "List Rental Packages" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/equipment" -H "Authorization: Bearer $TOKEN")
assert_status "List Equipment" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/shop" -H "Authorization: Bearer $TOKEN")
assert_status "Get Shop Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/shop" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -X PATCH \
  -d '{"phone":"0532 111 22 33"}')
assert_status "Update Shop Profile" 200 "$HTTP_CODE"

CREATE_RENTER=$(curl -s -w "\n%{http_code}" "$API_URL/renters" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Test Kiracı","phone":"0544 999 88 77","bootSize":"41","skillLevel":"beginner"}')
HTTP_CODE=$(echo "$CREATE_RENTER" | tail -1)
assert_status "Create Renter" 201 "$HTTP_CODE"

RENTER_ID=$(echo "$CREATE_RENTER" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$RENTER_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/renters/$RENTER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"notes":"İlk kiralama"}')
  assert_status "Update Renter" 200 "$HTTP_CODE"

  CREATE_TUNE=$(curl -s -w "\n%{http_code}" "$API_URL/tune-jobs" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"scheduledAt\":\"2027-02-15T10:00:00Z\",\"type\":\"wax\",\"renterId\":\"$RENTER_ID\"}")
  TUNE_CODE=$(echo "$CREATE_TUNE" | tail -1)
  assert_status "Create Tune Job" 201 "$TUNE_CODE"

  TUNE_ID=$(echo "$CREATE_TUNE" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

  if [ -n "$TUNE_ID" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/tune-jobs/$TUNE_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -X DELETE)
    assert_status "Delete Tune Job" 200 "$HTTP_CODE"
  fi

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/renters/$RENTER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Renter" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
