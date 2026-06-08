# Keycloak Configuration Script for Windows PowerShell

$KEYCLOAK_URL = "http://localhost:8080"
$REALM = "TODO"
$CLIENT_ID = "todoprojekt-frontend"
$REDIRECT_URI = "http://localhost:5176/#/dashboard"

# Admin credentials (default for local Keycloak)
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin"

Write-Host "Configuring Keycloak..."
Write-Host "Keycloak URL: $KEYCLOAK_URL"
Write-Host "Realm: $REALM"
Write-Host "Client: $CLIENT_ID"
Write-Host "Redirect URI: $REDIRECT_URI"
Write-Host ""

try {
    # Step 1: Get admin token
    Write-Host "Getting admin token..."
    
    $tokenBody = @{
        client_id = "admin-cli"
        username = $ADMIN_USER
        password = $ADMIN_PASSWORD
        grant_type = "password"
    }
    
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
        -Method Post `
        -Body $tokenBody `
        -ContentType "application/x-www-form-urlencoded"
    
    $ACCESS_TOKEN = $tokenResponse.access_token
    
    if (-not $ACCESS_TOKEN) {
        Write-Host "Failed to get admin token. Keycloak may not be running."
        exit 1
    }
    
    Write-Host "Got admin token!"
    Write-Host ""
    
    # Step 2: Get the client
    Write-Host "Getting client configuration..."
    
    $headers = @{
        Authorization = "Bearer $ACCESS_TOKEN"
    }
    
    $clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients" `
        -Method Get `
        -Headers $headers
    
    $client = $clients | Where-Object { $_.clientId -eq $CLIENT_ID }
    
    if (-not $client) {
        Write-Host "Failed to find client '$CLIENT_ID'."
        exit 1
    }
    
    $CLIENT_UUID = $client.id
    Write-Host "Found client: $CLIENT_UUID"
    Write-Host ""
    
    # Step 3: Update the client configuration
    Write-Host "Updating client configuration..."
    
    $clientConfig = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$CLIENT_UUID" `
        -Method Get `
        -Headers $headers
    
    # Add the redirect URI to the list
    if ($clientConfig.redirectUris -notcontains $REDIRECT_URI) {
        $clientConfig.redirectUris += $REDIRECT_URI
        Write-Host "Added redirect URI: $REDIRECT_URI"
    } else {
        Write-Host "Redirect URI already configured"
    }
    
    $jsonBody = $clientConfig | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$CLIENT_UUID" `
        -Method Put `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $jsonBody
    
    Write-Host ""
    Write-Host "SUCCESS! Keycloak is now configured!"
    Write-Host ""
    Write-Host "Current redirect URIs:"
    $clientConfig.redirectUris | ForEach-Object { Write-Host "  - $_" }
    
} catch {
    Write-Host "ERROR: $_"
    exit 1
}
