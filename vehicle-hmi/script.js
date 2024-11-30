function toggleButtonAction() {
    const button = document.getElementById('toggleButton');
    const statusLabel = document.getElementById('ftchmi_currentstatusvalue');
    const fuelSwitch = document.getElementById('fuelSwitch');
    
    if (button.innerText === 'Open') {
        console.log('Trigger opening the fuel tank');

        // Send a message to the fuel tank to open
        const message = JSON.stringify({
            action: 'openFuelTank'
        });

        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = function() {
            socket.send(message);
        };

        socket.onerror = function(error) {
            console.error('WebSocket Error: ' + error);
        };

        button.innerText = 'Close';
        statusLabel.innerText = 'Open';
        fuelSwitch.checked = true;
    } else {
        button.innerText = 'Open';
        statusLabel.innerText = 'Closed';
        fuelSwitch.checked = false;
    }
}