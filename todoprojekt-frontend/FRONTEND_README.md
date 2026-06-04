# Todo App Frontend

Modernes React + Vite Frontend für die Todo-Applikation mit Keycloak OAuth2-Integration.

## 🚀 Features

- ✅ OAuth2 Authentifizierung via Keycloak
- 👥 Rollenbasierte UI (Lernende & Ausbilder)
- 📋 Todo-Verwaltung (CRUD-Operationen)
- 💬 Chat/Questions-System pro Todo
- 🎨 Responsive Design
- 🔒 JWT Token Management
- ⚡ Real-time Status Updates

## 📦 Installation

### Voraussetzungen
- Node.js 16+
- npm oder yarn
- Backend läuft auf http://localhost:8081
- Keycloak läuft auf http://localhost:8080

### Schritt 1: Dependencies installieren

\`\`\`bash
cd todoprojekt-frontend
npm install
\`\`\`

### Schritt 2: Umgebungsvariablen konfigurieren

Kopiere \`.env.example\` zu \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Bearbeite die Werte nach Bedarf:

\`\`\`env
# Keycloak Configuration
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=todo-realm
VITE_KEYCLOAK_CLIENT_ID=todo-app

# API Configuration
VITE_API_URL=http://localhost:8081/api
\`\`\`

## 🏃 Entwicklung starten

\`\`\`bash
npm run dev
\`\`\`

Die App öffnet sich unter http://localhost:5173

## 📂 Projektstruktur

\`\`\`
src/
├── components/          # React Komponenten
│   ├── Header.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   ├── TodoForm.tsx
│   ├── TodoDetail.tsx
│   └── QuestionList.tsx
├── pages/              # Seiten
│   ├── Dashboard.tsx   # Hauptseite
│   └── Loading.tsx     # Loading State
├── services/           # API & Auth Services
│   ├── keycloak.ts     # Keycloak Integration
│   ├── api.ts          # Axios-Konfiguration
│   ├── todoService.ts  # Todo API
│   └── questionService.ts  # Questions API
├── context/            # React Context
│   └── AuthContext.tsx # Auth State Management
├── hooks/              # Custom Hooks
│   └── useTodos.ts     # Todo Hooks
├── types/              # TypeScript Definitionen
│   └── index.ts
├── styles/             # CSS Dateien
└── App.jsx             # Main Component
\`\`\`

## 🔐 Authentifizierung

Die App nutzt OAuth2 mit Keycloak:

1. Benutzer wird automatisch zur Keycloak-Login-Seite weitergeleitet
2. Nach erfolgreichem Login wird ein JWT-Token erhalten
3. JWT-Token wird in API-Requests mitgesendet
4. Token wird automatisch aktualisiert bei Ablauf

### Rollen

Das System unterstützt zwei Rollen:

- **ROLE_READ** (Lernender)
  - Kann Todos ansehen
  - Kann Status ändern (Open → In Progress → Done)
  - Kann Todos annehmen
  - Kann Fragen/Kommentare stellen

- **ROLE_UPDATE** (Ausbilder)
  - Kann Todos erstellen
  - Kann Todos bearbeiten und löschen
  - Kann Status zurücksetzen
  - Kann alle Fragen/Kommentare sehen

## 📝 API Endpoints

Die App kommuniziert mit folgenden Endpoints:

### Todos
- \`GET /api/todos\` - Alle Todos abrufen
- \`GET /api/todos/{id}\` - Einzelnes Todo
- \`POST /api/todos\` - Neues Todo erstellen (ROLE_UPDATE)
- \`PUT /api/todos/{id}\` - Todo aktualisieren (ROLE_UPDATE)
- \`DELETE /api/todos/{id}\` - Todo löschen (ROLE_UPDATE)
- \`PATCH /api/todos/{id}/status\` - Status ändern
- \`PATCH /api/todos/{id}/accept\` - Todo annehmen

### Questions
- \`GET /api/todos/{id}/questions\` - Fragen zum Todo
- \`POST /api/todos/{id}/questions\` - Neue Frage stellen

## 🛠️ Build & Production

\`\`\`bash
# Production Build
npm run build

# Vorschau des Builds
npm run preview
\`\`\`

## 🧹 Linting

\`\`\`bash
npm run lint
\`\`\`

## 🤝 Integration mit Backend

Das Frontend erwartet folgende Struktur vom Backend:

### Todo Response
\`\`\`json
{
  "id": 1,
  "title": "Aufgabe 1",
  "description": "Beschreibung",
  "assignTo": "Lernender Name",
  "status": "Open",
  "createdAt": "2024-06-04T10:00:00Z"
}
\`\`\`

### Question Response
\`\`\`json
{
  "id": 1,
  "content": "Frage oder Kommentar",
  "author": "Benutzername",
  "timestamp": "2024-06-04T10:00:00Z",
  "todo": { /* Todo Object */ }
}
\`\`\`

## 📚 Zusätzliche Ressourcen

- [Keycloak Dokumentation](https://www.keycloak.org/documentation)
- [React Dokumentation](https://react.dev)
- [Vite Dokumentation](https://vitejs.dev)

## 👨‍💻 Troubleshooting

### "Keycloak not initialized" Fehler
- Stelle sicher, dass Keycloak auf http://localhost:8080 läuft
- Überprüfe die \`VITE_KEYCLOAK_*\` Umgebungsvariablen
- Refresh die Seite im Browser

### "API Connection Error"
- Kontrolliere, dass das Backend auf http://localhost:8081 läuft
- Überprüfe die \`VITE_API_URL\` Umgebungsvariable
- Schau die Browser-Konsole für CORS-Fehler

### Todos werden nicht angezeigt
- Stelle sicher, dass du angemeldet bist
- Überprüfe die Browser-Konsole für Errors
- Kontrolliere die Backend-Logs

## 📄 Lizenz

MIT
