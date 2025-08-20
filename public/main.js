const createButton = document.getElementById('create-game');
const joinButton = document.getElementById('join-game');
const nameInput = document.getElementById('name');
const codeInput = document.getElementById('game-code');

const ws = new WebSocket(`ws://${window.location.host}`);

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === 'created') {
        sessionStorage.setItem('gameCode', data.code);
        sessionStorage.setItem('adminCode', data.adminCode);
        window.location.href = `/admin.html`;
    }
};

createButton.addEventListener('click', () => {
    ws.send(JSON.stringify({ action: 'create' }));
});

joinButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const code = codeInput.value.trim().toUpperCase();
    if (name && code) {
        sessionStorage.setItem('playerName', name);
        sessionStorage.setItem('gameCode', code);
        window.location.href = '/game.html';
    } else {
        alert('Bitte Name und Spiel-Code eingeben.');
    }
});
