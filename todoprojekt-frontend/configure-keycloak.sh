#!/bin/bash

# Keycloak Configuration Script
# This script configures the Keycloak server to accept the redirect_uri

KEYCLOAK_URL="http://localhost:8080"
REALM="TODO"
CLIENT_ID="todoprojekt-frontend"
REDIRECT_URI="http://localhost:5176/#/dashboard"

# Admin credentials (default for local Keycloak)
ADMIN_USER="admin"
ADMIN_PASSWORD="admin"

echo "🔐 Configuring Keycloak..."
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Realm: $REALM"
echo "Client: $CLIENT_ID"
echo "Redirect URI: $REDIRECT_URI"

# Step 1: Get admin token
echo "📝 Getting admin token..."
TOKEN_RESPONSE=$(curl -s -X POST \
  "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to get admin token. Please check Keycloak credentials."
  echo "Response: $TOKEN_RESPONSE"
  exit 1
fi

echo "✅ Got admin token"

# Step 2: Get the client
echo "🔍 Getting client configuration..."
CLIENT_RESPONSE=$(curl -s -X GET \
  "$KEYCLOAK_URL/admin/realms/$REALM/clients" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

CLIENT_UUID=$(echo $CLIENT_RESPONSE | grep -o "\"clientId\":\"$CLIENT_ID\"" -A 50 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$CLIENT_UUID" ]; then
  echo "❌ Failed to find client. Please check that the client exists in Keycloak."
  echo "Response: $CLIENT_RESPONSE"
  exit 1
fi

echo "✅ Found client: $CLIENT_UUID"

# Step 3: Update the client configuration
echo "🔧 Updating client configuration..."

CLIENT_CONFIG=$(curl -s -X GET \
  "$KEYCLOAK_URL/admin/realms/$REALM/clients/$CLIENT_UUID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

# Add the redirect URI to the list
UPDATED_CONFIG=$(echo $CLIENT_CONFIG | jq ".redirectUris += [\"$REDIRECT_URI\"]")

curl -s -X PUT \
  "$KEYCLOAK_URL/admin/realms/$REALM/clients/$CLIENT_UUID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATED_CONFIG"

echo "✅ Client configuration updated!"
echo "✅ Keycloak is now configured to accept: $REDIRECT_URI"
