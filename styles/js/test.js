var socket = io.connect();

function enLigne() {

socket.emit('ligne');
}

socket.on('retour', function () {
	alert('RETOUR !');
});
