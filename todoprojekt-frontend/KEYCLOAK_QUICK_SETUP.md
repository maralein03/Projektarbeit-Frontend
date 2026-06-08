# 🔐 KEYCLOAK SETUP - ANLEITUNG

## Schnelle Konfiguration (2 Minuten)

### Schritt 1: Admin-Konsole öffnen
```
http://localhost:8080/admin
```

### Schritt 2: Login
- Verwenden Sie Ihre Admin-Credentials

### Schritt 3: Realm TODO auswählen
Klicken Sie links auf "TODO" (wenn nicht sichtbar, müssen Sie es erstellen)

### Schritt 4: Client konfigurieren
1. Gehen Sie zu **Clients** im linken Menü
2. Klicken Sie auf **todoprojekt-frontend**
3. Scrollen Sie runter zu **Valid Redirect URIs**
4. Klicken Sie **Add URI** und geben ein:
   ```
   http://localhost:5176/#/dashboard
   ```
5. Klicken Sie **Save**

### Schritt 5: Web Origins (CORS)
1. Scrollen Sie zu **Web Origins**
2. Klicken Sie **Add Origin** und geben ein:
   ```
   http://localhost:5176
   ```
3. Klicken Sie **Save**

## ✅ FERTIG!

Jetzt können Sie die App testen:

```
1. Öffnen Sie: http://localhost:5176
2. Klicken Sie: "Mit Keycloak anmelden"
3. Sie werden zu Keycloak weitergeleitet
4. Melden Sie sich an
5. Sie werden automatisch zum Dashboard weitergeleitet
```

## 🧪 Test-Benutzer erstellen (Optional)

1. Im Admin-Panel: **Users** → **Add user**
2. Username: `testuser`
3. Tab **Credentials**: Passwort setzen
4. Tab **Role Mapping**: 
   - Rollen hinzufügen: `CREATE`, `UPDATE`, `READ`, `DELETE`
5. **Save**

Dann können Sie sich mit diesem Benutzer anmelden.

## ❓ Probleme?

### "Invalid parameter: redirect_uri"
- Überprüfen Sie, dass die Redirect URI **exakt** ist:
  ```
  http://localhost:5176/#/dashboard
  ```
- Achten Sie auf Leerzeichen und korrekte Groß-/Kleinschreibung

### "Connection refused"
- Keycloak läuft nicht
- Starten Sie Keycloak mit:
  ```bash
  docker run -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -p 8080:8080 quay.io/keycloak/keycloak:latest start-dev
  ```

### "Realm not found"
- Das Realm TODO existiert nicht
- Erstellen Sie es im Admin-Panel: **Create realm**

## 📞 Support

Falls etwas nicht funktioniert, überprüfen Sie:
1. Keycloak läuft auf http://localhost:8080
2. Sie sind als Admin angemeldet
3. Realm "TODO" existiert
4. Client "todoprojekt-frontend" existiert
5. Redirect URI ist korrekt konfiguriert
