var socket = io.connect();
var log = document.getElementById('test');
var nombre;


window.onload = function () {
	refresh();
}

socket.on('event', function (heure, type, message) {
		console.log('reception');
		if (type == 'SOCKET')
			document.getElementById('tableau').innerHTML += '<tr class="success" id="'+i+'"><td>'+heure[i]+'</td><td>'+type[i]+'</td><td>'+message[i]+'</td></tr>';
		else
			document.getElementById('tableau').innerHTML += '<tr><td>'+heure+'</td><td>'+type+'</td><td>'+message+'</td></tr>';
		nombre ++;
	});

socket.on('recuperation', function (heure, type, message) {
	for (var i = 0; i < message.length; i++) {
		if (type[i] == 'SOCKET')
			document.getElementById('tableau').innerHTML += '<tr class="success" id="'+i+'"><td>'+heure[i]+'</td><td>'+type[i]+'</td><td>'+message[i]+'</td></tr>';
		else
			document.getElementById('tableau').innerHTML += '<tr><td>'+heure[i]+'</td><td>'+type[i]+'</td><td>'+message[i]+'</td></tr>'; 
	}
	nombre = message.length;
});
	
function refresh() {
	document.getElementById('tableau').innerHTML = '';
	socket.emit('recup');
}

function supprimer() {
	socket.emit('delete');
	for (var i = 0; i < nombre; i++) {
		$("#"+i).hide("slow");
	}
	//document.getElementById('tableau').innerHTML = '';
}

/* function deleteOne(id) {
	socket.emit('deleteOne', id);
	console.log('Tentative de suppression de '+id);
	refresh();
} */