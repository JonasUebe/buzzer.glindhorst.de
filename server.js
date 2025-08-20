const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

let games = {};

const generateGameCode = () => {
    let code;
    do {
        code = Math.random().toString(36).substring(2, 7).toUpperCase();
    } while (games[code]);
    return code;
};

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const { action, code, name, adminCode } = data;
        console.log(`Received action: ${action} from ${name || 'unknown'} for game ${code || 'N/A'}`);

        switch (action) {
            case 'create': {
                const gameCode = generateGameCode();
                const newAdminCode = Math.random().toString(36).substring(2, 12);
                games[gameCode] = {
                    admin: { ws, code: newAdminCode },
                    players: [],
                    buzzedPlayer: null,
                    buzzersLocked: false
                };
                console.log(`Game created: ${gameCode} with adminCode: ${newAdminCode}`);
                ws.send(JSON.stringify({ action: 'created', code: gameCode, adminCode: newAdminCode }));
                break;
            }
            case 'join': {
                if (games[code]) {
                    const player = { name, ws };
                    games[code].players.push(player);
                    ws.gameCode = code;
                    ws.playerName = name;
                    console.log(`Player ${name} joined game ${code}`);
                    broadcastPlayerList(code);
                } else {
                    console.log(`Attempt to join non-existent game: ${code}`);
                    ws.send(JSON.stringify({ action: 'error', message: 'Spiel nicht gefunden.' }));
                }
                break;
            }
            case 'buzz': {
                const game = games[ws.gameCode];
                if (game && !game.buzzersLocked) {
                    game.buzzersLocked = true;
                    game.buzzedPlayer = ws.playerName;
                    console.log(`Player ${ws.playerName} buzzed in game ${ws.gameCode}`);
                    broadcastGameState(ws.gameCode);
                }
                break;
            }
            case 'reset': {
                if (games[code] && games[code].admin.code === adminCode) {
                    games[code].buzzedPlayer = null;
                    games[code].buzzersLocked = false;
                    console.log(`Buzzers reset for game ${code}`);
                    broadcastGameState(code);
                }
                break;
            }
             case 'getPlayers': {
                if (games[code] && games[code].admin.code === adminCode) {
                    console.log(`Admin requested player list for game ${code}`);
                    broadcastPlayerList(code);
                } else {
                    console.log(`Admin request for player list failed for game ${code}. Admin code mismatch or game not found.`);
                }
                break;
            }
            case 'admin_reconnect': {
                if (games[code] && games[code].admin.code === adminCode) {
                    games[code].admin.ws = ws; // Update the admin's WebSocket
                    ws.gameCode = code; // Store gameCode on the admin's ws object
                    console.log(`Admin reconnected for game: ${code}`);
                    broadcastPlayerList(code); // Send initial player list
                    broadcastGameState(code); // Send initial game state
                } else {
                    console.log(`Admin reconnect failed for game: ${code}. Admin code mismatch or game not found.`);
                    ws.send(JSON.stringify({ action: 'error', message: 'Admin-Verbindung fehlgeschlagen.' }));
                }
                break;
            }
        }
    });

    ws.on('close', () => {
        console.log(`WebSocket connection closed for ${ws.playerName || 'unknown'} in game ${ws.gameCode || 'N/A'}`);
        if (ws.gameCode) {
            const game = games[ws.gameCode];
            if (game) {
                // If the closed connection was the admin's, mark it as closed or handle appropriately
                if (game.admin && game.admin.ws === ws) {
                    console.log(`Admin connection for game ${ws.gameCode} closed.`);
                    // Optionally, you might want to clear the admin.ws or set a flag
                    // game.admin.ws = null; // Or handle admin disconnection more robustly
                }

                game.players = game.players.filter(p => p.ws !== ws);
                if (game.buzzedPlayer === ws.playerName) {
                    game.buzzedPlayer = null;
                    game.buzzersLocked = false;
                }
                broadcastPlayerList(ws.gameCode);
            }
        }
    });
});

const broadcastPlayerList = (code) => {
    const game = games[code];
    if (game) {
        const playerNames = game.players.map(p => p.name);
        console.log(`Broadcasting player list for game ${code}: ${playerNames.join(', ')}`);
        if (game.admin.ws.readyState === WebSocket.OPEN) {
            game.admin.ws.send(JSON.stringify({ action: 'playerList', players: playerNames }));
        } else {
            console.log(`Admin WebSocket not open for game ${code}. State: ${game.admin.ws.readyState}`);
        }
    }
};

const broadcastGameState = (code) => {
    const game = games[code];
    if (game) {
        const message = JSON.stringify({
            action: 'gameState',
            buzzedPlayer: game.buzzedPlayer,
            buzzersLocked: game.buzzersLocked
        });
        console.log(`Broadcasting game state for game ${code}: Buzzed: ${game.buzzedPlayer}, Locked: ${game.buzzersLocked}`);
        
        const allConnections = [game.admin.ws, ...game.players.map(p => p.ws)];
        allConnections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
};


server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});