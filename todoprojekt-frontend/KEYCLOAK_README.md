# Todo App - Keycloak Authentication Setup

## 🔐 Keycloak Integration

Diese Todo-App unterstützt Keycloak-basierte Authentifizierung mit OAuth2.

### Anforderungen

- **Keycloak Server**: http://localhost:8080
- **Realm**: `TODO`
- **Client**: `todoprojekt-frontend`
- **Frontend URL**: http://localhost:5176

### 🚀 Schneller Start

#### Option 1: Keycloak lokal starten (Docker)

```bash
docker run \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -p 8080:8080 \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

Dann öffnen Sie: http://localhost:8080/admin

#### Option 2: Keycloak manuell einrichten

1. Navigieren Sie zu http://localhost:8080/admin
2. Melden Sie sich mit Ihren Admin-Credentials an
3. Folgen Sie der Anleitung in `KEYCLOAK_SETUP.md`

### 📋 Konfigurationsschritte

1. **Realm erstellen**: `TODO`
2. **Client erstellen**: `todoprojekt-frontend`
3. **Valid Redirect URIs hinzufügen**:
   - `http://localhost:5176/#/dashboard`
   - `http://localhost:5176/#/login`
   - `http://localhost:5176/*`
4. **Web Origins konfigurieren**: `http://localhost:5176`

### 👥 Test-Benutzer erstellen

1. Im Admin-Panel: Realm `TODO` → Users → Add user
2. Geben Sie einen Namen ein (z.B. "lernender")
3. Tab "Credentials": Passwort setzen
4. Tab "Role Mapping": Rollen zuweisen:
   - `CREATE` - Kann Todos erstellen
   - `UPDATE` - Ist Ausbilder/Trainer
   - `READ` - Kann Todos lesen
   - `DELETE` - Kann Todos löschen

### 🔄 Login-Flow

```
User clicks "Anmelden"
    ↓
Browser redirects to Keycloak
    ↓
User logs in to Keycloak
    ↓
Keycloak redirects back to app
    ↓
App receives authorization code
    ↓
Keycloak client verifies code
    ↓
User is authenticated in app
    ↓
Redirect to dashboard
```

### 🐛 Troubleshooting

**Problem**: "Invalid parameter: redirect_uri"
- Überprüfen Sie, dass die Redirect URI genau `http://localhost:5176/#/dashboard` ist
- Keine Leerzeichen oder Tippfehler

**Problem**: "Connection refused"
- Keycloak läuft nicht auf http://localhost:8080
- Starten Sie Keycloak mit Docker oder Ihrer Installation

**Problem**: "Realm not found"
- Das Realm `TODO` existiert nicht
- Erstellen Sie es im Admin-Panel

### 🔗 Weiterführende Ressourcen

- [Keycloak Dokumentation](https://www.keycloak.org/documentation)
- [JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [OAuth2 Flow](https://www.keycloak.org/docs/latest/server_admin/index.html#_oidc)

---

## 📝 Notizen für Entwickler

### Keycloak Service (`src/services/keycloak.ts`)

- `initKeycloak()` - Initialisiert Keycloak ohne Redirect
- `loginWithKeycloak()` - Leitet zum Keycloak-Login-Screen um
- `getUserInfo()` - Holt Benutzerinformationen
- `getToken()` - Holt das OAuth2 Token

### Auth Context (`src/context/AuthContext.ts`)

- Verwaltet globalen Auth-State
- Subscriber-Pattern für State-Änderungen
- Fallback zu Demo-Mode bei Keycloak-Fehler

### Login Page (`src/pages/LoginPage.ts`)

- Zeigt "Mit Keycloak anmelden" Button
- Redirects zu Keycloak beim Klick
- Automatische Navigation zum Dashboard nach Login
