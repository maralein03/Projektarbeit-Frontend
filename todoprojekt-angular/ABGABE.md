# Abgabe – Projektarbeit Modul 294

> **Frontend einer interaktiven Webapplikation realisieren**
> Dieses Dokument ist das Deckblatt / die Inhaltsübersicht der Abgabe-ZIP.

---

## 1. Persönliche Angaben

| | |
|---|---|
| **Name** | `<Nachname>` |
| **Vorname** | `<Vorname>` |
| **Kurs** | `<Kursname>` |
| **PC-Nr.** | `<PC-Nr.>` |
| **Datum** | 2026-06-11 |
| **Kursleiter** | `<Name Kursleiter>` |
| **Projekttitel** | Todoprojekt – Aufgabenverwaltung für Lernende & Ausbilder:innen |
| **ZIP-Dateiname** | `<nachname_vorname>_Projektarbeit_m294.zip` |

---

## 2. Inhalt der Abgabe-ZIP

Die Abgabe-ZIP `<nachname_vorname>_Projektarbeit_m294.zip` enthält:

```
<nachname_vorname>_Projektarbeit_m294.zip
├── ABGABE.md                          ← dieses Dokument
├── PROJEKTBESCHREIBUNG.md             ← Projektbeschreibung
├── KONFIGURATION.md                   ← Setup / DB / Keycloak / Ports
└── todoprojekt-angular.zip            ← Source Code (ohne node_modules)
    └── todoprojekt-angular/
        ├── .git/                      ← Git-Historie
        ├── src/
        ├── public/
        ├── package.json
        ├── angular.json
        ├── eslint.config.js
        ├── tsconfig*.json
        ├── README.md
        └── …
```

> ⚠️ **Vor dem Zippen wurde der Ordner `node_modules/` gelöscht.**
> Der Kursleiter installiert die Abhängigkeiten mit `npm install`.

---

## 3. Wichtige Dokumente (alle in dieser ZIP)

| Dokument | Inhalt | Datei |
|---|---|---|
| **Abgabe-Deckblatt** | Diese Übersicht | [ABGABE.md](ABGABE.md) |
| **Projektbeschreibung** | Use Cases, Architektur, Tech-Stack, KN294-Mapping | [PROJEKTBESCHREIBUNG.md](PROJEKTBESCHREIBUNG.md) |
| **Konfiguration** | DB, Keycloak (Realm/Rollen/User), Ports, Start-Reihenfolge | [KONFIGURATION.md](KONFIGURATION.md) |
| **README** | Standard-Angular-Doku (CLI-Befehle) | [README.md](README.md) |

---

## 4. Schnellstart für den Kursleiter

```powershell
# 1. ZIP entpacken
Expand-Archive .\todoprojekt-angular.zip -DestinationPath .

# 2. In Projektordner wechseln
cd .\todoprojekt-angular

# 3. Abhängigkeiten installieren
npm install

# 4. Backend & Keycheck & DB starten (siehe KONFIGURATION.md)

# 5. Dev-Server starten
npm start
# → http://localhost:4200
```

**Tests & Lint:**
```powershell
npm test       # 19 Vitest Unit Tests
npm run lint   # ESLint, 0 Errors
```

---

## 5. Erfüllungsnachweis – Modul 294 Kriterien

| Bereich | Kriterium | Status |
|---|---|---|
| **Setup Projekt** | Projektdokumentation | ✅ |
| | Git-Versionierung (`.git/` enthalten) | ✅ |
| | Projekt- und Codestruktur (components/services/guards/…) | ✅ |
| **Backend-Anbindung** | CRUD-Services (5 Services) | ✅ |
| | JSON → TypeScript-Interfaces | ✅ |
| | Keycloak OAuth + Login / Logout | ✅ |
| | XSRF-Token (`withXsrfConfiguration`) | ✅ |
| | CORS konfiguriert (Frontend ≠ Standard-Port) | ✅ |
| **Komponenten** | ≥ 8 Komponenten (10 vorhanden) | ✅ |
| | Validierung von Eingaben (Reactive Forms) | ✅ |
| | Routing + AuthGuard + RoleGuard | ✅ |
| | Rollenabhängige Anzeige (Directive + `*ngIf`) | ✅ |
| **Testing & Codestyle** | Unit Test Komponente (`todo-form.spec.ts`) | ✅ |
| | Unit Test Service mit allen CRUD-Methoden (`todo.spec.ts`) | ✅ |
| | Vitest + Angular Testing | ✅ |
| | Lint ohne Fehler | ✅ |

**Tests-Ergebnis:** 4 Spec-Dateien · **19 / 19 Tests passed** ✅
**Lint-Ergebnis:** **0 Errors** ✅

---

## 6. Eingesetzte Software-Versionen

| Tool | Version |
|---|---|
| Angular | 22.0.1 |
| Node.js | (empfohlen: 20.x LTS) |
| npm | 11.16.0 |
| TypeScript | 6.0.2 |
| keycloak-js | 26.2.4 |
| Vitest | 4.1.x |
| ESLint | 10.3.x |
| Spring Boot (Backend) | 3.2.5 |
| Keycloak | 26.2.4 |
| PostgreSQL | 16 |

---

## 7. Anleitung zum Erstellen der Abgabe-ZIP

```powershell
# 1. In den Projekt-Frontend Ordner wechseln
cd C:\Users\admin.local\Projektarbeit-Frontend\todoprojekt-angular

# 2. node_modules löschen (sonst > 500 MB!)
Remove-Item -Recurse -Force .\node_modules

# 3. Source-Code-ZIP erstellen
Compress-Archive -Path . -DestinationPath ..\todoprojekt-angular.zip

# 4. Abgabe-ZIP zusammenstellen (im Eltern-Ordner)
cd ..
$name = "spichiger_mara"   # ← anpassen
Compress-Archive `
  -Path .\todoprojekt-angular.zip,
        .\todoprojekt-angular\ABGABE.md,
        .\todoprojekt-angular\PROJEKTBESCHREIBUNG.md,
        .\todoprojekt-angular\KONFIGURATION.md `
  -DestinationPath ".\${name}_Projektarbeit_m294.zip"
```

---

## 8. Bestätigung

Mit der Abgabe bestätige ich, dass:

- [ ] Die Arbeit selbständig durchgeführt wurde
- [ ] Verwendete Quellen in [PROJEKTBESCHREIBUNG.md](PROJEKTBESCHREIBUNG.md) angegeben sind
- [ ] Der Ordner `node_modules/` aus der ZIP entfernt wurde
- [ ] Das Projekt mit `npm install && npm start` lokal startet
- [ ] `npm test` 19/19 Tests besteht
- [ ] `npm run lint` ohne Fehler durchläuft

**Ort, Datum:** _____________________  **Unterschrift:** _____________________
