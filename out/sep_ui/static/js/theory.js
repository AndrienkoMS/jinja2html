const COMPLETE_THEORY_BUTTON_ID = 'completeTheoryButton'

let completeTheoryButton;

if (false) {  // or false
    console.log = () => { };
}

const buildBody = function (action, data) {
    return JSON.stringify({
        action: action,
        data: data
    });
};

const setupWebSocket = () => {
    console.log('Initializing socket connection');
    this.ws = new WebSocket(`{{ web_socket_url }}`)
    this.ws.onerror = function (e) {
        console.error('Web socket is in error', e);
    };
    this.ws.onopen = function (e) {
        console.log('Web socket is open');
    };
    this.ws.onmessage = function (e) {
        handleIncomingEvent(JSON.parse(e.data));
    };
    this.ws.onclose = function () {
        console.log('Web socket is closed');
        setTimeout(setupWebSocket, 1000);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    setupWebSocket();
    completeTheoryButton = document.getElementById(COMPLETE_THEORY_BUTTON_ID);

    completeTheoryButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('complete_theory', {}));
        completeTheoryButton.disabled = true;
        completeTheoryButton.innerText = 'Completed';
    });
});