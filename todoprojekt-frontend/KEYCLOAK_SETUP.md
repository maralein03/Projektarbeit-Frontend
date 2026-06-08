# Keycloak Konfiguration - Anleitung

## Problem
Die Keycloak Login-Umleitung funktioniert nicht mit dem Fehler: "Invalid parameter: redirect_uri"

## Lösung

### Schritt 1: Keycloak Admin-Konsole öffnen
Öffnen Sie Ihren Browser und gehen Sie zu:
```
http://localhost:8080/admin
```

### Schritt 2: Sich als Admin anmelden
- Username: Ihre Admin-Credentials
- Password: Ihre Admin-Credentials

### Schritt 3: Zum Client navigieren
1. Wählen Sie das Realm **TODO** in der linken Spalte
2. Klicken Sie auf **Clients** im Menü
3. Klicken Sie auf den Client **todoprojekt-frontend**

### Schritt 4: Redirect URI hinzufügen
1. Scrollen Sie runter zu **Valid Redirect URIs**
2. Klicken Sie auf **Add URI**
3. Fügen Sie folgende URLs hinzu:
   - `http://localhost:5176/#/dashboard`
   - `http://localhost:5176/#/login`
   - `http://localhost:5176/*`
4. Klicken Sie auf **Speichern**

### Schritt 5: Client aktualisieren
1. Scrollt Sie zur **Web Origins** Sektion
2. Fügen Sie hinzu: `http://localhost:5176`
3. Klicken Sie auf **Speichern**

## Fertig!
Jetzt sollte der Keycloak-Login-Button funktionieren und Sie werden zu Keycloak weitergeleitet.

Nach dem Login werden Sie automatisch zurück zur Todo-App weitergeleitet und angemeldet.

## Troubleshooting

### "Invalid parameter: redirect_uri" Fehler
- Stellen Sie sicher, dass die Redirect URI in Keycloak genau diese URL ist: `http://localhost:5176/#/dashboard`
- Überprüfen Sie die Rechtschreibung (Groß-/Kleinbuchstaben)

### "Realm not found"
- Stellen Sie sicher, dass das Realm **TODO** existiert
- Falls nicht, erstellen Sie es: https://www.keycloak.org/docs/latest/server_admin/index.html#_create_realm

### "Client not found"  
- Stellen Sie sicher, dass der Client **todoprojekt-frontend** im Realm **TODO** existiert

## Weiterführende Ressourcen
- Keycloak Dokumentation: https://www.keycloak.org/documentation
- Keycloak Admin Guide: https://www.keycloak.org/docs/latest/server_admin/
