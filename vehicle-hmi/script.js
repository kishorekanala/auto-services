function toggleButtonAction() {
    const button = document.getElementById('toggleButton');
    const statusLabel = document.getElementById('ftchmi_currentstatusvalue');
    const fuelSwitch = document.getElementById('fuelSwitch');
    
    if (button.innerText === 'Open') {
        button.innerText = 'Close';
        statusLabel.innerText = 'Open';
        fuelSwitch.checked = true;
    } else {
        button.innerText = 'Open';
        statusLabel.innerText = 'Closed';
        fuelSwitch.checked = false;
    }
}
    