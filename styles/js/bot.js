var socket = io.connect();
var etat;
var isLaunched;
var Enligne = '<span class="offset1 label label-success">Bot en Ligne !</span>';
var Occupe = '<span class="offset1 label label-warning">Bot occupé !</span>';
var Horsligne = '<span class="offset1 label label-important">Bot hors Ligne !</span>';
var unLaunched = '<a class="offset5 btn btn-success" onclick="launch()" href="#" id="afficher">Lancer le bot !</a>';
var launched = '<a class="offset5 btn btn-danger" onclick="stop()" href="#" id="afficher">Arrêter le bot !</a>'
var btnEnabled = '<a class="btn btn-success" onclick="enLigne()" href="#">En ligne</a><a class="btn btn-warning" onclick="occupe()" href="#">Occupé</a><a class="btn btn-danger" onclick="horsLigne()" href="#">Hors-ligne</a>';
var btnDisabled = '<a class="btn btn-success disabled" href="#">En ligne</a><a class="btn btn-warning disabled" href="#">Occupé</a><a class="btn btn-danger disabled" href="#">Hors-ligne</a>';
var formEnabled = '<input type="text" class="input-small" id="id">';
var formDisabled = '<input type="text" class="input-small uneditable-input" disabled>';

window.onload = function () {
	miseEnPage();
	update();
}

function launch() {
	socket.emit('launch');
	enLigne();
	document.getElementById('afficher').innerHTML = launched;
	isLaunched = true;
	miseEnPage();
}

function stop() {
	socket.emit('deco');
	horsLigne(); 
	document.getElementById('afficher').innerHTML = unLaunched;
	isLaunched = false;
	miseEnPage();
}

function changerPseudo() {
	var form = document.forms['formPseudo'];
	var pseudo = form.elements['pseudo'].value;
	if(pseudo != "") {
		socket.emit('changePseudo', pseudo);
		$("#formPseudo").hide("slow");
		$(".alertPseudo").show("slow");
		document.getElementById('textPseudo').innerHTML = 'Pseudo changé en <strong>'+pseudo+'</strong>';
		$(".closePseudo").click(function() {
			$(".alertPseudo").hide("slow");
			$("#formPseudo").show("slow");
		})
	}
	return false;
}

function echangeAvec() {
	var form = document.forms['formTrade'];
	var id = form.elements['id'].value;
	if(id != "") {
		socket.emit('echangeAvec', id);
		$("#formTrade").hide("slow");
		$(".alertTrade").show("slow");
		document.getElementById('textTrade').innerHTML = 'Demande de trade avec <strong>'+id+'</strong>';
		$(".closeTrade").click(function() {
			$(".alertTrade").hide("slow");
			$("#formTrade").show("slow");
		})		
	}
	return false;
}

function enLigne() {
	socket.emit('ligne');
	etat = 'online';
	update();
}

function occupe() {
	socket.emit('occupe');
	etat = 'away';
	update();
}

function horsLigne() {
	socket.emit('horsLigne');
	etat = 'offline';
	update();
}

function update()
{
	if (etat == 'online') {
		document.getElementById('label').innerHTML = Enligne;
	}
	else if (etat == 'away') {
		document.getElementById('label').innerHTML = Occupe;
	}
	else {
		document.getElementById('label').innerHTML = Horsligne;
	}
	
	if (!isLaunched)
		document.getElementById('afficher').innerHTML = unLaunched;
	else
		document.getElementById('afficher').innerHTML = launched;
}

function miseEnPage() {
	if (isLaunched)
	{
		document.getElementById('btnEtat').innerHTML = btnEnabled;
		document.getElementById('pseudoForm').innerHTML = formEnabled;
	}
	else
	{
		document.getElementById('btnEtat').innerHTML = btnDisabled;
		document.getElementById('pseudoForm').innerHTML = formDisabled;
		
	}
}