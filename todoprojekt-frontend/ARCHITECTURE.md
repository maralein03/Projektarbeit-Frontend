# Architektur-Übersicht: Todo App Frontend

## System-Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                      React/Vite App                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AuthProvider (Context)                  │   │
│  │  - JWT Token Management                             │   │
│  │  - User Info & Roles                                │   │
│  │  - Keycloak Integration                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                ┌─────────┴──────────────┐                   │
│                │                        │                   │
│        ┌───────▼────────┐      ┌───────▼────────┐          │
│        │   Header Comp  │      │  Dashboard     │          │
│        │  (User Info)   │      │  (Main Layout) │          │
│        └────────────────┘      └───────┬────────┘          │
│                                        │                    │
│                          ┌─────────────┴────────────┐      │
│                          │                          │      │
│                  ┌───────▼──────┐        ┌────────▼──┐   │
│                  │  TodoList    │        │ Instructor│   │
│                  │  Component   │        │   Panel   │   │
│                  │              │        └────────┬──┘   │
│                  ├─ TodoItem    │              │         │
│                  ├─ Filtering   │              │         │
│                  └───────┬──────┘              │         │
│                          │                     │         │
│        ┌─────────────────┴──────────────┬─────┴──┐     │
│        │                                │        │     │
│   ┌────▼─────┐  ┌──────────┐  ┌───────▼──┐  │      │
│   │TodoDetail│  │TodoForm  │  │Questions │  │      │
│   │ (Modal)  │  │(Create)  │  │  /Chat   │  │      │
│   └──────────┘  └──────────┘  └──────────┘  │      │
│                                             │      │
└────────────────────────────────────────────┤────────┘
                                              │
                    ┌─────────────────────────┘
                    │
        ┌───────────▼────────────┐
        │   API Services Layer   │
        ├───────────────────────┤
        │ - Keycloak Service    │
        │ - Todo Service        │
        │ - Question Service    │
        │ - Axios Client        │
        └───────────┬───────────┘
                    │
        ┌───────────▼────────────┐
        │  Backend API (Port 8081)
        │  OAuth2 Resource Server│
        └───────────────────────┘
```

## Datenfluss

### 1. Authentifizierung
```
App Load
  ↓
AuthContext → Keycloak Init
  ↓
Browser redirect zu Keycloak Login
  ↓
Token erhalten + setzen in localStorage
  ↓
Dashboard rendern
```

### 2. Todo-Liste laden
```
Dashboard mounted
  ↓
useTodos Hook → todoService.getAllTodos()
  ↓
Axios GET /api/todos (mit JWT)
  ↓
Backend-Response → State update
  ↓
TodoList rendern
```

### 3. Todo-Status ändern
```
User clicks "In Bearbeitung"
  ↓
TodoItem → todoService.updateTodoStatus()
  ↓
Axios PATCH /api/todos/{id}/status
  ↓
Backend-Update
  ↓
Dashboard aktualisiert via fetchTodos()
  ↓
UI refreshed
```

### 4. Frage stellen
```
User schreibt Frage
  ↓
QuestionList → questionService.createQuestion()
  ↓
Axios POST /api/todos/{id}/questions
  ↓
Backend speichert Question
  ↓
Question zu lokaler Liste hinzufügt
  ↓
Neuer Comment sichtbar
```

## Rollenbasierte Features

### Lernender (ROLE_READ)
- Sieht nur seine zugewiesenen Todos
- Kann Status ändern: Open → In Progress → Done
- Kann Aufgabe annehmen (PATCH /accept)
- Kann Fragen/Kommentare stellen

### Ausbilder (ROLE_UPDATE)
- Kann alle Todos sehen
- Kann neue Todos erstellen
- Kann Todos bearbeiten & löschen
- Kann Status zurücksetzen
- Sieht spezielle "Instructor Panel"

## Fehlerbehandlung

```javascript
// API-Fehler werden abgefangen
try {
  const todos = await todoService.getAllTodos()
} catch (error) {
  // 1. Token-Fehler → automatisch refresh
  // 2. 401 Unauthorized → Neulogin erforderlich
  // 3. Network Error → Fehlermessage anzeigen
  // 4. Server Error → Fehlermessage anzeigen
}
```

## Styling-System

```css
CSS Variables:
- --primary-color: #007bff
- --danger-color: #dc3545
- --success-color: #28a745
- --shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
- --border-radius: 8px

Responsive Design:
- Desktop: 1400px
- Tablet: 768px - 1024px
- Mobile: < 768px
```

## State Management

```
App
└─ AuthContext
   ├─ user
   ├─ isAuthenticated
   ├─ isLoading
   └─ logout()

Dashboard
├─ selectedTodo (useState)
├─ isFormOpen (useState)
├─ isDetailOpen (useState)
└─ todos (useTodos hook)
   ├─ todos[]
   ├─ isLoading
   ├─ error
   └─ fetchTodos()
```

## Performance-Optimierungen

1. **Token-Caching**: JWT wird in localStorage gespeichert
2. **Interceptors**: Automatisches Token-Refresh bei 401
3. **Lazy Loading**: Komponenten nur laden wenn nötig
4. **Memoization**: React.memo für wiederholte Komponenten (optional)
5. **Query Caching**: @tanstack/react-query für Data Caching

## Security-Features

1. **JWT Token**: Sicherer Transport von Auth-Infos
2. **CORS**: Backend prüft Anfrage-Origin
3. **HTTPS-Ready**: Kann mit HTTPS deployed werden
4. **Keycloak**: Industriestandard für OAuth2
5. **Token Expiry**: Automatisches Refresh & Logout bei Ablauf
