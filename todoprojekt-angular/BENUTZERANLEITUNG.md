# Benutzeranleitung – Todoprojekt

Webapplikation zur Verwaltung von Lernaufgaben zwischen **Ausbilder:in** und **Lernenden**.

---

## 1. Voraussetzungen

Damit die Anwendung benutzt werden kann, müssen folgende Dienste laufen:

| Dienst | URL / Port |
|--------|------------|
| Keycloak | http://localhost:8080 |
| Backend (Spring Boot) | http://localhost:8082 |
| Frontend (Angular) | http://localhost:4200 |
| PostgreSQL | localhost:5432 |

Details zur Konfiguration: siehe [KONFIGURATION.md](KONFIGURATION.md).

---

## 2. Anmeldung

1. Browser öffnen und **http://localhost:4200** aufrufen.
2. Die Seite leitet automatisch zum Keycloak-Login weiter.
3. Mit einem der Testbenutzer anmelden:

   | Benutzer | Passwort | Rolle |
   |----------|----------|-------|
   | `ausbilder` | `hallo` | Ausbilder:in (ROLE_UPDATE) |
   | `lernender` | `hallo` | Lernende:r (ROLE_READ) |

4. Nach erfolgreichem Login erscheint das **Dashboard**.

> **Abmelden:** über den Button **Logout** rechts oben in der Kopfleiste.

---

## 3. Übersicht der Oberfläche

```
┌──────────────────────────────────────────────────────┐
│  Header  (Logo · Benutzer · Logout)                  │
├──────────┬───────────────────────────────────────────┤
│ Sidebar  │   Hauptbereich                            │
│ - Dashb. │   (Dashboard / Aufgabenliste / Detail)    │
│ - Aufg.  │                                           │
│ - Neu    │                                           │
└──────────┴───────────────────────────────────────────┘
```

- **Header**: zeigt den eingeloggten Benutzer und enthält den Logout-Button.
- **Sidebar**: Navigation zu Dashboard und Aufgabenliste. Der Eintrag „Neue Aufgabe" ist nur für Ausbilder:innen sichtbar.
- **Hauptbereich**: zeigt die aktuell aufgerufene Seite.

---

## 4. Funktionen für Ausbilder:innen

### 4.1 Aufgabe erstellen

1. In der Sidebar auf **„+ Neue Aufgabe"** klicken (oder Button im Dashboard).
2. Formular ausfüllen:
   - **Titel** (Pflicht, 3–100 Zeichen)
   - **Beschreibung** (Pflicht, max. 500 Zeichen)
   - **Zugewiesen an** (Username des Lernenden, z. B. `lernender`)
   - **Status** (Standard: `OPEN`)
3. Auf **„Erstellen"** klicken.
4. Eine grüne Benachrichtigung („Aufgabe erstellt") erscheint, die Liste wird aktualisiert.

### 4.2 Aufgabe bearbeiten

1. In der Aufgabenliste die gewünschte Aufgabe anklicken → Detailansicht.
2. Felder direkt anpassen und **Speichern**.

### 4.3 Aufgabe löschen

1. In der Aufgabenliste auf das 🗑️-Symbol der Aufgabe klicken.
2. Sicherheitsabfrage bestätigen.
3. Die Aufgabe inkl. zugehöriger Chat-Nachrichten und Fragen wird entfernt.

---

## 5. Funktionen für Lernende

### 5.1 Aufgaben einsehen

- Im **Dashboard** werden alle dem Lernenden zugewiesenen Aufgaben angezeigt, gruppiert nach Status:
  - 📌 **Offen**
  - ⏳ **In Bearbeitung**
  - ✅ **Erledigt**

### 5.2 Status ändern

1. In der Aufgabenliste neben der Aufgabe auf einen der Status-Buttons klicken:
   - **📌 Offen**
   - **⏳ Bearbeitung**
   - **✅ Erledigt**
2. Der neue Status wird sofort gespeichert; eine Bestätigung erscheint.

> Lernende können Aufgaben **nicht** löschen oder erstellen.

---

## 6. Chat zu einer Aufgabe

Über den Chat können Ausbilder:in und Lernende:r Rückfragen zu einer Aufgabe austauschen.

1. In der Aufgabenliste neben der gewünschten Aufgabe auf das **💬-Symbol** klicken.
2. Es öffnet sich ein modales Chat-Fenster:
   - **Eigene Nachrichten** erscheinen rechts hervorgehoben mit der Bezeichnung **„Ausbilder (Sie)"** bzw. **„Lernender (Sie)"**.
   - **Nachrichten des Gegenübers** stehen links mit der Bezeichnung der jeweils anderen Rolle.
3. Im Eingabefeld unten Text eingeben und **„Senden"** klicken (oder ↵).
4. Neue Nachrichten der Gegenseite werden alle 3 Sekunden automatisch nachgeladen.
5. Das Chatfenster über das **✕** oben rechts schliessen.

### Notification-Badge

- Sobald für eine Aufgabe ungelesene Chat-Nachrichten vorliegen, erscheint neben dem 💬-Symbol ein pulsierender ✉️-Hinweis.
- Sobald der Chat geöffnet oder eine Antwort gesendet wird, gilt der Chat als gelesen und das Badge verschwindet.

---

## 7. Fragen zu einer Aufgabe

Neben dem Chat gibt es einen Bereich für strukturierte **Fragen** (z. B. Aufgabenklärungen).

1. In der Detailansicht einer Aufgabe auf **„Fragen"** klicken.
2. Frage eingeben und absenden.
3. Ausbilder:innen können Fragen als **„Beantwortet"** markieren.

---

## 8. Rollen & Berechtigungen

| Aktion | Lernende:r | Ausbilder:in |
|--------|------------|--------------|
| Aufgaben sehen (eigene) | ✅ | ✅ |
| Alle Aufgaben sehen | ❌ | ✅ |
| Aufgabe erstellen | ❌ | ✅ |
| Aufgabe bearbeiten | ❌ | ✅ |
| Aufgabe löschen | ❌ | ✅ |
| Status ändern | ✅ | ✅ |
| Chat lesen / schreiben | ✅ | ✅ |
| Frage stellen | ✅ | ✅ |
| Frage als beantwortet markieren | ❌ | ✅ |

Nicht erlaubte Aktionen werden in der Oberfläche **gar nicht erst angezeigt** (rollenbasierte Sichtbarkeit).

---

## 9. Häufige Probleme

| Problem | Lösung |
|---------|--------|
| Browser zeigt „This site can't be reached" | Frontend läuft nicht – `npm start` im Ordner `todoprojekt-angular` ausführen. |
| Login-Seite lädt nicht | Keycloak (Port 8080) ist nicht gestartet. |
| Nach Login: „Failed to load todos" | Backend (Port 8082) ist nicht erreichbar oder DB nicht gestartet. |
| Chat zeigt UUID statt Rolle | Cache leeren (Strg + F5) – neueste Version verwendet Rollennamen. |
| „403 Forbidden" beim Speichern | Du verwendest den falschen Benutzer (z. B. `lernender` kann nicht erstellen). Mit `ausbilder` anmelden. |
| Token abgelaufen | Abmelden und erneut anmelden. |

---

## 10. Abmelden

- Oben rechts auf **Logout** klicken.
- Die Session wird sowohl in der Anwendung als auch in Keycloak beendet.

---

*Stand: 2026-06-12*
