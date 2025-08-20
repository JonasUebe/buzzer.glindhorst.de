const playerNameDisplay = document.getElementById('player-name');
const buzzerButton = document.getElementById('buzzer');
const buzzerFeedback = document.getElementById('buzzer-feedback');
const gameStatusDisplay = document.getElementById('game-status');

const playerName = sessionStorage.getItem('playerName');
const gameCode = sessionStorage.getItem('gameCode');

playerNameDisplay.textContent = playerName;

if (!playerName || !gameCode) {
    window.location.href = '/';
}

const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
    ws.send(JSON.stringify({ action: 'join', code: gameCode, name: playerName }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.action) {
        case 'gameState':
            if (data.buzzedPlayer) {
                if (data.buzzedPlayer === playerName) {
                    buzzerFeedback.textContent = 'DU hast gebuzzert!';
                    buzzerFeedback.classList.add('buzzed-self');
                } else {
                    buzzerFeedback.textContent = `${data.buzzedPlayer} hat gebuzzert!`;
                    buzzerFeedback.classList.add('buzzed-other');
                }
                buzzerButton.disabled = true;
            } else {
                buzzerFeedback.textContent = '';
                buzzerFeedback.classList.remove('buzzed-self', 'buzzed-other');
                buzzerButton.disabled = false;
            }
            break;
        case 'error':
            gameStatusDisplay.textContent = data.message;
            buzzerButton.disabled = true;
            break;
    }
};

buzzerButton.addEventListener('click', () => {
    if (!buzzerButton.disabled) {
        ws.send(JSON.stringify({ action: 'buzz' }));
    }
});
