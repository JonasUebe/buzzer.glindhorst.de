# Gameshow Buzzer

Dies ist eine einfache Gameshow-Buzzer-Anwendung, die es mehreren Spielern ermöglicht, an einem Spiel teilzunehmen und zu buzzern. Ein Admin-Panel zeigt, wer zuerst gebuzzert hat, und ermöglicht das Zurücksetzen der Buzzer für die nächste Runde.

## Funktionen

-   **Spiel erstellen:** Erstelle ein neues Spiel und erhalte einen eindeutigen Spiel-Code.
-   **Spiel beitreten:** Trete einem bestehenden Spiel mit einem Spiel-Code und deinem Namen bei.
-   **Admin-Panel:** Zeigt alle verbundenen Spieler an und wer gebuzzert hat. Ermöglicht das Zurücksetzen der Buzzer.
-   **Spieler-Ansicht:** Ein großer Buzzer-Button für die Spieler, der anzeigt, ob sie gebuzzert haben oder jemand anderes.
-   **Echtzeit-Kommunikation:** Verwendet WebSockets für sofortige Updates zwischen Spielern und Admin.
-   **Docker-Unterstützung:** Einfache Bereitstellung und Ausführung der Anwendung mit Docker Compose.

## Einrichtung und Ausführung

Die Anwendung kann einfach mit Docker Compose gestartet werden.

1.  **Klone das Repository** (falls noch nicht geschehen):
    ```bash
    git clone <dein-repo-url>
    cd buzzer.glindhorst.de
    ```

2.  **Starte die Anwendung mit Docker Compose:**
    Navigiere in das Hauptverzeichnis des Projekts (wo sich die `docker-compose.yml`-Datei befindet) und führe den folgenden Befehl aus:
    ```bash
    docker-compose up --build
    ```
    Dieser Befehl baut das Docker-Image und startet den Container. Die Anwendung wird auf Port `8080` verfügbar sein.

3.  **Greife auf die Anwendung zu:**
    Öffne deinen Webbrowser und navigiere zu:
    ```
    http://localhost:8080
    ```

## Nutzung

### Spiel erstellen

1.  Besuche `http://localhost:8080`.
2.  Klicke auf den Button "Erstellen" unter "Neues Spiel erstellen".
3.  Du wirst zum Admin-Panel weitergeleitet, wo du den Spiel-Code und den Admin-Code siehst. Teile den Spiel-Code mit deinen Spielern.

### Als Spieler beitreten

1.  Besuche `http://localhost:8080`.
2.  Gib deinen Namen und den Spiel-Code (den du vom Admin erhalten hast) in die entsprechenden Felder unter "Spiel beitreten" ein.
3.  Klicke auf "Beitreten". Du wirst zur Spieler-Ansicht mit dem Buzzer weitergeleitet.

### Admin-Panel

Das Admin-Panel zeigt dir:
-   Den Spiel-Code.
-   Den Status des Buzzers (wer gebuzzert hat).
-   Eine Liste aller verbundenen Spieler.

Klicke auf "Buzzer zurücksetzen", um den Buzzer für eine neue Runde freizugeben.

## Entwicklung

Wenn du Änderungen am Code vornimmst, musst du die Docker-Container neu starten, damit die Änderungen wirksam werden:

```bash
docker-compose down
docker-compose up --build
```

