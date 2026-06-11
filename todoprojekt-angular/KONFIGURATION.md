# Konfigurationseinstellungen – Projektarbeit Modul 294

Dieses Dokument enthält alle nötigen Einstellungen, um das Projekt lokal zu starten.

---

## 1. Netzwerk-Ports

| Komponente | Standard | Verwendet | Begründung |
|------------|----------|-----------|------------|
| Angular Frontend | 4200 | **4200** | Standard |
| Spring Boot Backend | 9090 | **8082** | Port 9090 war bereits belegt |
| Keycloak | 8080 | **8080** | Standard |
| PostgreSQL | 5432 | **5432** | Standard |

> ⚠️ Da das Backend nicht auf 9090 läuft, wurden CORS-Einstellungen im Backend
> (`SecurityConfig.java`) und in Keycloak (Web Origins) entsprechend angepasst.

---

## 2. Datenbank (PostgreSQL)

| Einstellung | Wert |
|-------------|------|
| Host | `localhost` |
| Port | `5432` |
| Datenbankname | `todo_db` |
| User | `postgres` |
| Passwort | `postgres` |

**Schema:** Tabellen `todo`, `chat_message`, `question` werden via Hibernate
(`spring.jpa.hibernate.ddl-auto=update`) automatisch beim Backend-Start angelegt.

**JDBC-URL:** `jdbc:postgresql://localhost:5432/todo_db`

---

## 3. Keycloak

| Einstellung | Wert |
|-------------|------|
| URL | `http://localhost:8080` |
| Realm | **`TODO`** |
| Client-ID (Frontend) | `todoprojekt-frontend` |
| Client-Typ | Public (PKCE) |
| Valid Redirect URIs | `http://localhost:4200/*` |
| Web Origins | `http://localhost:4200` |

### Rollen (Realm Roles)

| Rolle | Beschreibung |
|-------|--------------|
| `ROLE_READ` | Lesender Zugriff (Lernende:r) |
| `ROLE_UPDATE` | Schreibender Zugriff (Ausbilder:in) – Aufgaben erstellen / löschen / Status ändern |

### Testbenutzer

| Username | Passwort | Rollen |
|----------|----------|--------|
| `ausbilder` | `hallo` | `ROLE_UPDATE`, `ROLE_READ` |
| `lernender` | `hallo` | `ROLE_READ` |

---

## 4. Start-Reihenfolge

1. **PostgreSQL** starten (Service oder `pg_ctl start`)
2. **Keycloak** starten – Port 8080
   ```powershell
   .\bin\kc.bat start-dev
   ```
3. **Backend** starten (Port 8082)
   ```powershell
   cd C:\...\todoprojekt
   mvn spring-boot:run
   ```
4. **Frontend** starten (Port 4200)
   ```powershell
   cd todoprojekt-angular
   npm install
   npm start
   ```
5. Browser öffnen → http://localhost:4200 → Login über Keycloak

---

## 5. Frontend-Konfigurationsdatei

Alle URLs/Ports sind zentral in folgender Datei konfiguriert:

- `src/environments/environment.ts` (Development)

```ts
export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'TODO',
    clientId: 'todoprojekt-frontend'
  },
  apiUrl: 'http://localhost:8082/api'
};
```

---

## 6. Sicherheit

| Mechanismus | Implementierung |
|-------------|-----------------|
| **OAuth2 Access Token** | Keycloak-JS Adapter, Token wird im JWT-Interceptor als `Authorization: Bearer ...` mitgegeben |
| **XSRF-Token** | `provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }))` in [app.config.ts](src/app/app.config.ts) |
| **CORS** | Backend erlaubt `http://localhost:4200` |
| **Route Guards** | `authGuard` + `RoleGuard` mit `data: { role: 'ROLE_UPDATE' }` |
| **Rollen-Directive** | `*appHasRole="'ROLE_UPDATE'"` ([has-role.directive.ts](src/app/directives/has-role.directive.ts)) |

---

## 7. Tests ausführen

```powershell
cd todoprojekt-angular
npm test              # Vitest Unit Tests (19 Tests)
npm run lint          # ESLint
```

---

## 8. Build für Produktion

```powershell
npm run build
# Output: dist/todoprojekt-angular/browser/
```
