document.addEventListener('DOMContentLoaded', (event) => {
    const fuelSwitch = document.getElementById('fuelSwitch');
    fuelSwitch.addEventListener('change', handleFuelSwitchChange);
});

function handleFuelSwitchChange(event) {
    const fuelSwitch = event.target;
    const button = document.getElementById('toggleButton');
    const statusLabel = document.getElementById('ftchmi_currentstatusvalue');
    
    const socket = new WebSocket('ws://localhost:8080');

    if (fuelSwitch.checked) {
        console.log('Trigger opening the fuel tank');

        // Send a message to the fuel tank to open
        const message = JSON.stringify({
            action: 'openFuelTank'
        });

        socket.onopen = function() {
            socket.send(message);
        };

        socket.onerror = function(error) {
            console.error('WebSocket Error: ' + error);
        };

        socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            console.log('Received message from fuel tank:', response);
            console.log('Action:', response.action);
            if (response.action === 'Openack') {
                console.log('Fuel tank opened successfully');
                button.innerText = 'Close';
                statusLabel.innerText = 'Open';
            } else {
                console.error('Failed to open fuel tank');
            }
        };

    } else {
        console.log('Trigger closing the fuel tank');

        // Send a message to the fuel tank to close
        const message = JSON.stringify({
            action: 'closeFuelTank'
        });

        socket.onopen = function() {
            socket.send(message);
        };

        socket.onerror = function(error) {
            console.error('WebSocket Error: ' + error);
        };

        socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            console.log('Received message from fuel tank:', response);
            console.log('Action:', response.action);
            if (response.action === 'Closeack') {
                console.log('Fuel tank closed successfully');
                button.innerText = 'Open';
                statusLabel.innerText = 'Closed';
            } else {
                console.error('Failed to close fuel tank');
            }
        };
    }
}

function toggleButtonAction() {
    const button = document.getElementById('toggleButton');
    const statusLabel = document.getElementById('ftchmi_currentstatusvalue');
    const fuelSwitch = document.getElementById('fuelSwitch');
    
    const socket = new WebSocket('ws://localhost:8080');

    if (button.innerText === 'Open') {
        console.log('Trigger opening the fuel tank');

        // Send a message to the fuel tank to open
        const message = JSON.stringify({
            action: 'openFuelTank'
        });

        socket.onopen = function() {
            socket.send(message);
        };

        socket.onerror = function(error) {
            console.error('WebSocket Error: ' + error);
        };

        socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            console.log('Received message from fuel tank:', response);
            console.log('Action:', response.action);
            if (response.action === 'Openack') {
                console.log('Fuel tank opened successfully');
                button.innerText = 'Close';
                statusLabel.innerText = 'Open';
                fuelSwitch.checked = true;
            } else {
                console.error('Failed to open fuel tank');
            }
        };

    } else {
        console.log('Trigger closing the fuel tank');

        // Send a message to the fuel tank to close
        const message = JSON.stringify({
            action: 'closeFuelTank'
        });

        socket.onopen = function() {
            socket.send(message);
        };

        socket.onerror = function(error) {
            console.error('WebSocket Error: ' + error);
        };

        socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            console.log('Received message from fuel tank:', response);
            console.log('Action:', response.action);
            if (response.action === 'Closeack') {
                console.log('Fuel tank closed successfully');
                button.innerText = 'Open';
                statusLabel.innerText = 'Closed';
                fuelSwitch.checked = false;
            } else {
                console.error('Failed to close fuel tank');
            }
        };
    }
}