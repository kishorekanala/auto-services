const zmq = require('zeromq');
const sock = zmq.socket('sub');

sock.connect('tcp://localhost:5555');

sock.on('message', function(topic, message) {
    const status = message.toString();
    const button = document.getElementById('toggleButton');
    const statusLabel = document.getElementById('ftchmi_currentstatusvalue');

    if (status === 'close') {
        button.innerText = 'Open';
        statusLabel.innerText = 'Closed';
    } else if (status === 'open') {
        button.innerText = 'Close';
        statusLabel.innerText = 'Open';
    }

    // Unsubscribe after receiving the status
    sock.unsubscribe('FUELTANKCAP_STATUS');
});

function toggleButtonAction() {
    sock.subscribe('FUELTANKCAP_STATUS');
}