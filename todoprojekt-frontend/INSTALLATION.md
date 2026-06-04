# Installation der erforderlichen Dependencies

Das Frontend benötigt zusätzliche Pakete. Da npm lokal nicht verfügbar ist, können Sie die Dependencies auf folgende Wege installieren:

## Option 1: VS Code Terminal
1. Öffnen Sie ein Terminal in VS Code (Terminal → New Terminal)
2. Installieren Sie die Pakete mit folgendem Befehl:

```bash
npm install keycloak-js axios react-router-dom @tanstack/react-query
```

## Option 2: Manual package.json Update
Falls npm im Terminal nicht verfügbar ist, installieren Sie Node.js von https://nodejs.org/

Nach Installation können Sie folgende Befehle verwenden:

```bash
# In das Projektverzeichnis wechseln
cd todoprojekt-frontend

# Alle Dependencies installieren
npm install

# Abhängigkeiten für die App hinzufügen
npm install keycloak-js axios react-router-dom @tanstack/react-query

# Development-Server starten
npm run dev
```

## Option 3: Direkte Bearbeitung package.json
Sie können die Abhängigkeiten auch manuell zur package.json hinzufügen:

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "keycloak-js": "^23.0.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.25.0"
  },
  "devDependencies": {
    // ... bestehende devDependencies
    "typescript": "^5.3.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3"
  }
}
```

Dann `npm install` ausführen.

## Umgebungsvariablen einrichten

1. Erstellen Sie eine `.env.local` Datei im Projektroot (neben package.json)
2. Kopieren Sie den Inhalt von `.env.example`:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=todo-realm
VITE_KEYCLOAK_CLIENT_ID=todo-app
VITE_API_URL=http://localhost:8081/api
```

3. Passen Sie die Werte an, falls nötig (z.B. andere Ports für Keycloak/Backend)

## Projekt starten

Sobald Dependencies installiert sind:

```bash
npm run dev
```

Die App wird dann unter http://localhost:5173 verfügbar sein.

## Troubleshooting

**Problem: "Port 5173 bereits in Gebrauch"**
- Verwenden Sie einen anderen Port: `npm run dev -- --port 5174`

**Problem: Keycloak-Login funktioniert nicht**
- Überprüfen Sie, ob Keycloak auf http://localhost:8080 läuft
- Kontrollieren Sie die `.env.local` Datei
- Schau die Browser-Konsole für Fehler (F12)

**Problem: API-Verbindung funktioniert nicht**
- Stelle sicher, dass das Backend auf http://localhost:8081 läuft
- Überprüfe die `.env.local` Datei
- Kontrolliere die Network-Requests im Browser (F12 → Network Tab)
