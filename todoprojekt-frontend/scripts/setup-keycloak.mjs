#!/usr/bin/env node

/**
 * Keycloak Auto-Configuration Script (ES Modules)
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const REALM = process.env.KEYCLOAK_REALM || 'TODO';
const CLIENT_ID = 'todoprojekt-frontend';
const REDIRECT_URI = 'http://localhost:5176/#/dashboard';
const ADMIN_USER = process.env.KEYCLOAK_ADMIN || 'admin';
const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

console.log('🔐 Keycloak Auto-Configuration');
console.log(`URL: ${KEYCLOAK_URL}`);
console.log(`Realm: ${REALM}`);
console.log(`Client: ${CLIENT_ID}`);
console.log(`Redirect URI: ${REDIRECT_URI}`);
console.log('');

async function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, KEYCLOAK_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function getAdminToken() {
  console.log('📝 Getting admin token...');
  return new Promise((resolve, reject) => {
    const url = new URL('/realms/master/protocol/openid-connect/token', KEYCLOAK_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const formData = `client_id=admin-cli&username=${ADMIN_USER}&password=${ADMIN_PASSWORD}&grant_type=password`;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(formData),
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            console.log('✅ Got admin token');
            resolve(parsed.access_token);
          } else {
            reject(new Error(`No access token in response: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse token response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(formData);
    req.end();
  });
}

async function getClient(token) {
  console.log(`🔍 Looking for client "${CLIENT_ID}"...`);
  try {
    const response = await makeRequest('GET', `/admin/realms/${REALM}/clients`, null, token);

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }

    const client = response.data.find((c) => c.clientId === CLIENT_ID);
    if (!client) {
      throw new Error(`Client "${CLIENT_ID}" not found in realm "${REALM}"`);
    }

    console.log(`✅ Found client: ${client.id}`);
    return client;
  } catch (error) {
    throw new Error(`Failed to get client: ${error.message}`);
  }
}

async function updateClient(token, client) {
  console.log(`🔧 Updating client configuration...`);
  try {
    // Ensure redirectUris is an array
    if (!Array.isArray(client.redirectUris)) {
      client.redirectUris = [];
    }

    // Add redirect URI if not already present
    if (!client.redirectUris.includes(REDIRECT_URI)) {
      client.redirectUris.push(REDIRECT_URI);
      console.log(`  Added redirect URI: ${REDIRECT_URI}`);
    } else {
      console.log(`  Redirect URI already configured`);
    }

    // Ensure webOrigins is configured
    if (!Array.isArray(client.webOrigins)) {
      client.webOrigins = [];
    }
    if (!client.webOrigins.includes('http://localhost:5176')) {
      client.webOrigins.push('http://localhost:5176');
      console.log(`  Added web origin: http://localhost:5176`);
    }

    // Update the client
    const response = await makeRequest('PUT', `/admin/realms/${REALM}/clients/${client.id}`, client, token);

    if (response.status !== 204) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
    }

    console.log('✅ Client configuration updated');
    return true;
  } catch (error) {
    throw new Error(`Failed to update client: ${error.message}`);
  }
}

async function main() {
  try {
    // Step 1: Get admin token
    const token = await getAdminToken();

    // Step 2: Get client
    const client = await getClient(token);

    // Step 3: Update client
    await updateClient(token, client);

    console.log('');
    console.log('✅ SUCCESS! Keycloak is now configured');
    console.log('');
    console.log('Current configuration:');
    console.log(`  Realm: ${REALM}`);
    console.log(`  Client: ${CLIENT_ID}`);
    console.log(`  Redirect URIs:`);
    if (Array.isArray(client.redirectUris)) {
      client.redirectUris.forEach((uri) => console.log(`    - ${uri}`));
    }
    console.log('');
    console.log('You can now login with Keycloak!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ ERROR:', error.message);
    console.error('');
    console.error('Make sure:');
    console.error(`  1. Keycloak is running on ${KEYCLOAK_URL}`);
    console.error(`  2. Realm "${REALM}" exists`);
    console.error(`  3. Client "${CLIENT_ID}" exists`);
    console.error(`  4. Admin credentials are correct (default: admin/admin)`);
    console.error('');
    process.exit(1);
  }
}

main();
