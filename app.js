var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');
var http = require('http'); 
var express = require('express');

var app = express();
var bot = new Steam.SteamClient();
var steamTrade = new SteamTrade();

var sentry = fs.readFileSync('sentry');
var pseudo = 'ilthados';
var mdp = 'alverde1';
var nomBot = '[BOT] Yadasko';
var admin = '76561198002996534';

var inventory;
var scrap;
var weapons;
var addedScrap;
var client;

// if we've saved a server list, use it
/*if (fs.existsSync('servers')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers'));
}*/

bot.logOn(pseudo, mdp, sentry);
 

bot.on('loggedOn', function() {
  console.log('Connecté !');
  bot.setPersonaName(nomBot); 
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

/************************************************************************************************************************************************************/

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/launch', function(req, res) {
	bot.logOn(pseudo, mdp, sentry);
	res.redirect('/');
});
 
app.listen(80);

