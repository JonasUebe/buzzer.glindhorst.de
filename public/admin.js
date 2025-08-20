const gameCodeDisplay = document.getElementById('game-code');
const buzzedPlayerDisplay = document.getElementById('buzzed-player');
const resetButton = document.getElementById('reset-button');
const playerList = document.getElementById('players');

const gameCode = sessionStorage.getItem('gameCode');
const adminCode = sessionStorage.getItem('adminCode');

gameCodeDisplay.textContent = gameCode;

if (!gameCode || !adminCode) {
    window.location.href = '/';
}

const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
    console.log('Admin WebSocket connected.');
    // Send an identification message to the server
    ws.send(JSON.stringify({ action: 'admin_reconnect', code: gameCode, adminCode: adminCode }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Admin received message:', data);

    switch (data.action) {
        case 'playerList':
            playerList.innerHTML = '';
            data.players.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                playerList.appendChild(li);
            });
            break;
        case 'gameState':
            if (data.buzzedPlayer) {
                buzzedPlayerDisplay.textContent = `${data.buzzedPlayer} hat gebuzzert!`;
                buzzedPlayerDisplay.classList.add('buzzed');
            } else {
                buzzedPlayerDisplay.textContent = 'Warte auf Buzz...';
                 buzzedPlayerDisplay.classList.remove('buzzed');
            }
            break;
    }
};

resetButton.addEventListener('click', () => {
    ws.send(JSON.stringify({ action: 'reset', code: gameCode, adminCode: adminCode }));
});
