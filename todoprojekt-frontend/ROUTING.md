# Routing System

Das Projekt implementiert ein **Client-seitiges Routing-System** mit Rollen-basierter Zugriffsschutz.

## Architektur

```
Router
├── Routes
│   ├── /login (LoginPage)
│   ├── /dashboard (DashboardPage)
│   └── / (Redirect zu /login oder /dashboard)
├── Auth Check
│   ├── Authentifizierung überprüfen
│   └── Rollen-basierter Zugriff
└── Layout
    ├── full (nur Content)
    └── with-header (Header + Content)
```

## Verfügbare Routen

### /login
- **Component:** LoginPage
- **Layout:** full
- **Auth:** Public (keine Authentifizierung erforderlich)
- **Beschreibung:** Login-Seite mit Keycloak-Integration

### /dashboard
- **Component:** DashboardPage
- **Layout:** with-header
- **Auth:** Private (Authentifizierung erforderlich)
- **Beschreibung:** Hauptdashboard mit Todo-Liste, Filter, und Detailansicht

### / (Default)
- **Component:** Auto-Redirect
- **Beschreibung:** Leitet basierend auf Authentifizierungsstatus weiter

## Router-API

### Registrierung einer Route
```typescript
router.register({
  path: '/mypage',
  name: 'My Page',
  component: async () => {
    // Component render logic
  },
  requiredRoles: ['ADMIN'], // Optional
  layout: 'with-header'      // Optional: 'full' | 'with-header'
});
```

### Navigation
```typescript
router.navigate('/dashboard');
```

### Auth setzen
```typescript
router.setAuth(true, ['ROLE_USER', 'ROLE_UPDATE']);
```

## Sicherheit

### Authentifizierung
- Wird über `authContext.getState()` überprüft
- Nicht authentifizierte Nutzer werden zu `/login` weitergeleitet
- Token wird in localStorage gespeichert

### Rollenschutz
```typescript
// Route nur für Ausbilder
router.register({
  path: '/admin',
  component: AdminPage.render,
  requiredRoles: ['UPDATE'] // Nur für UPDATE-Rolle
});
```

## Layout-System

### full Layout
```html
<div id="route-content"></div>
```

### with-header Layout
```html
<div id="header"></div>
<main>
  <div id="route-content"></div>
</main>
<div id="todoFormModal"></div>
<div id="todoDetail"></div>
```

## URL-Format

Das System nutzt **Hash-basiertes Routing** (#):
```
https://app.example.com/#/dashboard
https://app.example.com/#/login
https://app.example.com/
```

## Integration mit Keycloak

1. **Login-Flow:**
   - Nutzer navigiert zu `/login`
   - Klickt auf "Anmelden"
   - Wird zu Keycloak weitergeleitet
   - Nach erfolgreichem Login zurück zur App
   - Token wird in authContext gespeichert

2. **Auth-Check:**
   - Jede Navigation überprüft `authContext.getState()`
   - Token wird automatisch überprüft
   - Bei Ablauf wird erneut zu `/login` geleitet

## Fehlerbehandlung

- **Route nicht gefunden:** Umleitung zu `/`
- **Keine Berechtigung:** Umleitung zu `/dashboard`
- **Authentifizierung erforderlich:** Umleitung zu `/login`
- **API-Fehler:** Error-Dialog und Redirect zu `/login`

## Implementierung neuer Seiten

1. **Erstelle neue Page-Klasse:**
```typescript
export class MyPage {
  async render(): Promise<void> {
    const container = document.getElementById('route-content');
    // Render logic
  }
}
```

2. **Registriere in main.ts:**
```typescript
router.register({
  path: '/mypage',
  name: 'My Page',
  component: async () => {
    const page = new MyPage();
    await page.render();
  },
  layout: 'with-header'
});
```

3. **Navigation:**
```typescript
router.navigate('/mypage');
```

## Browser-Back-Button

Das System unterstützt vollständig Browser-Navigation:
- Vor/Zurück-Button funktioniert
- Browser-History wird automatisch verwaltet
- State wird in URL (Hash) gespeichert
