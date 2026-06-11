# Projektbeschreibung – Modul 294

> **TODO:** Felder mit `<...>` durch deine eigenen Angaben ersetzen.

---

## 1. Allgemeine Angaben

| | |
|---|---|
| **Name, Vorname** | `<Spichiger, Mara>` |
| **Kurs** | `<KursName>` |
| **Datum** | 2026-06-11 |
| **Kursleiter** | `<Name>` |
| **Projektname** | Todoprojekt – Lern-Aufgabenverwaltung |

---

## 2. Kurzbeschreibung

Webapplikation zur Verwaltung von Lernaufgaben („Todos") zwischen Ausbilder:in
und Lernenden. Ausbilder:innen können Aufgaben erstellen, einem Lernenden zuweisen
und den Status verwalten. Lernende sehen ihre zugewiesenen Aufgaben, können den
Status (Offen / In Bearbeitung / Erledigt) selbst ändern und über einen Chat
Rückfragen zur Aufgabe stellen.

---

## 3. Anwendungsfälle (Use Cases)

| # | Akteur | Funktion |
|---|--------|----------|
| 1 | Ausbilder:in | Aufgabe erstellen, bearbeiten, löschen |
| 2 | Ausbilder:in | Aufgabe einem Lernenden zuweisen |
| 3 | Lernende:r | Eigene Aufgaben einsehen |
| 4 | Lernende:r | Status der Aufgabe ändern |
| 5 | Beide | Chat-Nachrichten pro Aufgabe austauschen |
| 6 | Beide | Login / Logout via Keycloak |

---

## 4. Technologie-Stack

| Schicht | Technologie | Version |
|---------|-------------|---------|
| Frontend | Angular (Standalone Components) | 22.0.1 |
| Build | Angular CLI / esbuild | 22.0.1 |
| Styling | CSS | – |
| Forms | Reactive Forms | – |
| HTTP | HttpClient mit Interceptors | – |
| Auth | keycloak-js | 26.2.4 |
| Tests | Vitest + Angular Testing | 4.1.x |
| Linting | ESLint + angular-eslint | 10 / 22 |
| Backend | Spring Boot + Spring Security | 3.2.5 |
| DB | PostgreSQL | 16 |
| Auth-Server | Keycloak | 26.2.4 |

---

## 5. Architektur

```
Browser (Angular @ 4200)
   │
   │  HTTPS / JWT Bearer + XSRF-Token
   ▼
Spring Boot REST API (@ 8082)
   │           │
   │           └──► PostgreSQL (todo_db)
   ▼
Keycloak (@ 8080, realm: TODO)
```

### Frontend-Struktur

```
src/app/
├── components/        10 Komponenten (Header, Sidebar, Dashboard,
│                      TodoList, TodoForm, TodoDetail, Chat,
│                      ChatModal, QuestionList, Login)
├── services/          5 Services (Todo, Question, Chat, Auth, Keycloak)
├── guards/            authGuard, RoleGuard
├── interceptors/      jwtInterceptor, errorInterceptor
├── directives/        HasRoleDirective, HighlightStatus
├── models/            TypeScript-Interfaces (Todo, Question, ChatMessage, ...)
└── environments/      environment.ts (URLs / Ports)
```

---

## 6. Erfüllte Anforderungen aus dem KN294

### Setup Projekt
- ✅ Projektdokumentation: [README.md](README.md), [KONFIGURATION.md](KONFIGURATION.md)
- ✅ Git-Repository inkl. `.git/`
- ✅ Standard-Angular-Codestruktur

### Backend-Anbindung
- ✅ 5 Services (TodoService, QuestionService, ChatService, AuthService, KeycloakService)
- ✅ TodoService mit kompletten CRUD-Methoden
- ✅ JSON-Mapping über TypeScript-Interfaces (`Todo`, `Question`, `ChatMessage`, `ApiResponse<T>`)
- ✅ OAuth2 / JWT via Keycloak, Token-Austausch im `jwtInterceptor`
- ✅ XSRF-Token via `withXsrfConfiguration` in [app.config.ts](src/app/app.config.ts)
- ✅ CORS im Backend konfiguriert (siehe [KONFIGURATION.md](KONFIGURATION.md))

### Komponenten
- ✅ 10 Komponenten (> Anforderung 8)
- ✅ Validierung im `TodoForm` (Required, MinLength, MaxLength)
- ✅ Routing mit `authGuard` + `RoleGuard` (`data: { role: 'ROLE_UPDATE' }`)
- ✅ Rollenabhängige Anzeige in Dashboard, TodoList, Sidebar
- ✅ Strukturelle Directive `*appHasRole="'ROLE_UPDATE'"`

### Testing & Codestyle
- ✅ Unit-Test Komponente: [todo-form.spec.ts](src/app/components/todo-form/todo-form.spec.ts) (8 Tests)
- ✅ Unit-Test Service mit allen CRUD-Methoden: [todo.spec.ts](src/app/services/todo.spec.ts) (8 Tests)
- ✅ Insgesamt **19 Tests, alle grün**
- ✅ ESLint konfiguriert, `npm run lint` ohne Fehler

---

## 7. Besonderheiten / Erweiterungen

- **Toast-Benachrichtigungen** beim Erstellen/Löschen/Status-Wechsel
- **Pulsierender Briefumschlag** ✉️ als Notification-Badge für ungelesene
  Chat-Nachrichten (10s-Polling)
- **Cascade-Delete** im Backend (Chat + Fragen werden mit dem Todo gelöscht)
- **NgZone-Wrapping** der Keycloak-Promises im Interceptor zur Vermeidung
  hängender Change-Detection

---

## 8. Quellen & Hilfsmittel

- Angular-Dokumentation: https://angular.dev
- Keycloak-JS Adapter: https://www.npmjs.com/package/keycloak-js
- Vitest: https://vitest.dev
- Modul 294 Demoprojekt (als Referenz)

---

## 9. Bekannte Einschränkungen

- Kein automatisches Token-Refresh nach Tab-Inaktivität > Token-Lifetime
- Chat-Polling alle 3s (kein WebSocket / SSE)
- Keine i18n – Texte fest in Deutsch
