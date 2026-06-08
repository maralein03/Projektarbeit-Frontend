# Material Design Integration

Dieses Projekt nutzt **Angular Material** für ein modernes, benutzerfreundliches UI-Design.

## Installierte Pakete

```json
{
  "@angular/material": "^latest",
  "@angular/cdk": "^latest",
  "@angular/animations": "^latest"
}
```

## Integrierte Material-Features

### 1. Material Icons
- Roboto Font (Google Fonts)
- Material Icons Font
- Material Symbols (Outlined)

**Verfügbare Icons:**
- `task_alt` - Todo Logo
- `schedule` - Open Status
- `progress_activity` - In Progress Status
- `check_circle` - Done Status
- `verified` - Accepted Status
- `school` - Lernender Badge
- `logout` - Logout Button
- `filter_list` - Filter Icon

### 2. Material Design Theme
- **Theme:** Indigo-Pink (Modern Material Design)
- **Color Scheme:** 
  - Primary: #1976d2 (Indigo)
  - Accent: #ff4081 (Pink)
  - Success: #4caf50 (Green)
  - Error: #f44336 (Red)

### 3. Material Components
- **Buttons:** Material Button Style mit Icons
- **Icons:** Material Icons in allen Komponenten
- **Animations:** Smooth transitions und hover effects
- **Typography:** Roboto Font mit Material specs
- **Elevation:** Material shadows für Tiefenwirkung

## Komponenten mit Material-Design

### Header Component
- Material Icons für Filter-Buttons
- Gradient Background
- Material-style Badge für Rollen
- Material Icons für Logout-Button

### Button Styling
```css
.mat-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px; /* Material spec */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Icon Usage
```html
<span class="material-icons">task_alt</span>
```

## Verwendung in neuen Komponenten

### Buttons mit Icons
```html
<button class="mat-button">
  <span class="material-icons">add</span>
  Neu erstellen
</button>
```

### Icons standalone
```html
<span class="material-icons">done</span>
```

## CSS Variables (Material Aligned)
```css
:root {
  --primary-color: #1976d2;
  --secondary-color: #757575;
  --danger-color: #f44336;
  --success-color: #4caf50;
  --border-radius: 4px; /* Material spec (4px) */
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Material easing */
}
```

## Icon Reference
Alle verfügbaren Material Icons: https://fonts.google.com/icons

## Breaking Changes
- Font-Familie geändert von "Segoe UI" zu "Roboto"
- Border-Radius auf 4px vereinheitlicht (Material spec)
- Easing-Function zu Material-Standard geändert
