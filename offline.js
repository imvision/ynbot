var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');
var http = require('http'); 
var express = require('express');
//var io = require('socket.io');


var app = express();
var bot = new Steam.SteamClient();
var steamTrade = new SteamTrade();


var sentry = fs.readFileSync('sentry');
var pseudo = 'login';
var mdp = 'password';
var nomBot = '[BOT] Yadasko';
var admin = '76561198002996534';

var inventory;
var scrap;
var weapons;
var addedScrap;
var client;
var etat = 'offline';
var isLaunched = false;

var heure = [];
var type = [];
var message = [];
var id = [];

function getDateTime() {
	var date = new Date();
	
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
	return hour + ':' + min;
}

/************************************************************************************************************************************************************/

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.engine('jade', require('jade').__express);
app.use("/styles", express.static(__dirname + '/styles'));

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.post('/launch', function(req, res) {
	console.log('Post!');
});

app.get('/launch', function(req, res) {
	console.log('Connecté !');
	res.redirect('/');
});

app.get('/test', function(req, res) {
	res.render('index.jade', {etat: etat, isLaunched: isLaunched});
});

app.get('/log', function(req, res) {
	res.render('log.jade');
});


//io.listen(app.listen(80)).set('log level', 1);
var io = require('socket.io').listen(app.listen(80));
io.set('log level', 1);

/************************************************************************************************************************************************************/

io.sockets.on('connection', function (socket) {
	console.log('Client connecté !');
	
	socket.on('launch', function () {
		//bot.logOn(pseudo, mdp, sentry);
		isLaunched = true;
		console.log('SOCKET - Bot lancé');
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Bot Lancé');
		id.push(id.length); //Dur dur de commentcer ça ! On ajoute un id pour pouvoir le supprimer que lui.
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Bot lancé');
	});
	
	socket.on('deco', function () {
		isLaunched = false;
		console.log('SOCKET - Bot stoppé');
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Bot Arrêté');
		id.push(id.length);
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Bot Arrêté');
	});
	
    socket.on('ligne', function () {
		//bot.setPersonaState(Steam.EPersonaState.Online);
		etat = 'online';
		console.log('SOCKET - Bot en Ligne');
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Bot en Ligne');
		id.push(id.length);
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Bot en Ligne');		
	});
	
	socket.on('occupe', function () {
		etat = 'away';
		console.log('SOCKET - Bot Occupé');
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Bot Occupé');
		id.push(id.length);
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Bot Occupe');		
	});
		
	socket.on('horsLigne', function () {
		etat = 'offline';
		console.log('SOCKET - Bot hors Ligne');
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Bot Hors Ligne');
		id.push(id.length);
		//bot.setPersonaState(Steam.EPersonaState.Offline);
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Bot hors-Ligne');
	});
	
	socket.on('changePseudo', function (pseudo) {
		console.log('SOCKET - Pseudo du bot changé en ' + pseudo);
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Pseudo changé en <strong>'+pseudo+'</strong>');
		id.push(id.length);
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Pseudo changé en <strong>'+pseudo+'</strong>');
	});
	
	socket.on('echangeAvec', function (ID) {
		console.log('SOCKET - Demande de trade avec ' + ID);
		heure.push(getDateTime());
		type.push('SOCKET');
		message.push('Demande de trade avec <strong>'+ID+'</strong>');
		id.push(id.length);
		socket.broadcast.emit('event', getDateTime(), 'SOCKET', 'Demande de trade avec <strong>'+ID+'</strong>');
	});
	
	socket.on('recup', function () {
		socket.emit('recuperation', heure, type, message, id);
	});
	
	socket.on('delete', function () {
		heure = [];
		type = [];
		message = [];
		id = [];
	});
	
/* 	socket.on('deleteOne', function(ID) {
		heure.splice(ID, 1);
		type.slice(ID, 1);
		message.splice(ID, 1);
		id.splice(ID, 1);
		console.log('Tentative de suppression de '+ID);
	}); */
		
	
	
});

/***********************************************************************************************************************/

// if we've saved a server list, use it
/*if (fs.existsSync('servers')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers'));
}*/

//bot.logOn(pseudo, mdp, sentry);
 
bot.on('loggedOn', function() {
  console.log('Connecté !');
  bot.setPersonaName(nomBot);
  io.sockets.emit('event', 'Bot Connecté');

});


bot.on('webSessionID', function(sessionID) {
  console.log('Réception d\'un nouvel session ID:', sessionID);
  steamTrade.sessionID = sessionID;
  bot.webLogOn(function(cookies) {
    console.log('Réception d\'un nouveau cookie:', cookies);
    cookies.split(';').forEach(function(cookie) {
        steamTrade.setCookie(cookie);
    });
	  bot.setPersonaState(Steam.EPersonaState.Online);
  console.log('Bot actuellement en ligne !');
  });
});


bot.on('message', function(source, message, type, chatter) {
  if (message != '')
  {
	  console.log('Steam ID de l\'envoyeur : ' + source);
	  console.log('Pseudo de l\'envoyeur : ' + bot.users[source].playerName);
	  console.log('Message Recu : ' + message);
	  if (source == '76561198002996534') {
		bot.sendMessage(source, 'Salut Yadaskouille !', Steam.EChatEntryType.ChatMsg); // ChatMsg by default
	  }
	  else if (source == '76561198062540850') {
		bot.sendMessage(source, message, Steam.EChatEntryType.ChatMsg);
	  }
	  else if (source == '76561198025968923') {
		bot.sendMessage(source, 'Oooooh YUYU !! Bisous ?', Steam.EChatEntryType.ChatMsg);
	  }
  }
});


bot.on('tradeProposed', function(tradeID, otherClient) {
  console.log('Proposition de trade ! Acceptée');
  bot.respondToTrade(tradeID, true);
});


bot.on('sessionStart', function(otherClient) {
  inventory = [];
  scrap = [];
  weapons = 0;
  addedScrap = [];
  client = otherClient;
  console.log('En échange avec ' + bot.users[client].playerName);
  steamTrade.open(otherClient);
   steamTrade.loadInventory(440, 2, function(inv) {
     inventory = inv;
     scrap = inv.filter(function(item) { return item.name == 'Scrap Metal';});
	console.log('J\'ai actuellement ' + scrap.length + ' scraps dans mon inventaire !');
  });
});


steamTrade.on('chatMsg', function(msg) {
	console.log('Reception d\'un message ! ');
	console.log('"' + msg + '"');
	if (client == admin) {
		if (msg == 'give') {
			var nonScrap = inventory.filter(function(item) {
				return !~scrap.indexOf(item);
				});
			// console.log('Envoi de ' + nonScrap.length + ' items tradable à ' + bot.users[client].playerName); Buged ! Compte aussi les items non tradable !
			steamTrade.addItems(nonScrap);
			console.log('Envoi de ' + scrap.length + ' scraps à ' + bot.users[client].playerName);
			steamTrade.addItems(scrap);
		}
	}
});


steamTrade.on('ready', function() {
  console.log('Prêt');
  steamTrade.ready(function() {
    console.log('Confirmation');
    steamTrade.confirm();
  });
});


steamTrade.on('end', function(result) {console.log('trade', result);});
