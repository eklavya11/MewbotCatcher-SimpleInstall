//INITIALISATION DU BOT

function format(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
};

function SpamStart(msg, interval) {
    SpamTimeout = setInterval(function(){
		channeltalk.send(msg)
    }, interval);
}

function SpamStop() {
    clearTimeout(SpamTimeout);
}

function bot(){
	client.on('ready',function(){
		channeltalk = client.channels.get(channeltalk);
	});
	client.on('message', async msg => {
		if(msg.author.id == client.user.id || msg.author.id == "365975655608745985"){
			if(msg.embeds[0] != undefined){
				if(msg.embeds[0].title.includes('A wild')){
					var url = msg.embeds[0].image.url;
					request.get(url, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							var jsonobj = 'pokemons.json'
							jsonfile.readFile(jsonobj, function(err, obj) {
								PokeName = obj[md5Hex(body)];
								if(PokeName != undefined){
									console.log(colors.green('A wild ') + colors.rainbow(PokeName) + colors.green(' has appeared on : ' + msg.guild.name + ' in the channel : ' + msg.channel.name));
									console.log(colors.blue('Use : p!catch ' + PokeName));
									if(autocatcher == true){
									};
								};
							});
						};
					});
				}else if(msg.embeds[0].title.includes('Your ') && listactive == true && msg.channel == listchannel){
					if(listfirst == true){
						listfinished = "";
						listfirst = false;
						listpages = Math.ceil(msg.embeds[0].footer.text.replace('1-1','').replace('1-2','').replace('1-3','').replace('1-4','').replace('1-5','').replace('1-6','').replace('1-7','').replace('1-8','').replace('1-9','').replace('1-10','').replace('1-11','').replace('1-12','').replace('1-13','').replace('1-14','').replace('1-15','').replace('1-16','').replace('1-17','').replace('1-18','').replace('1-19','').replace('1-20','').replace(/\D+/g, '')/20);
						sleep(3000, function() {
							if(listpages >= 1){
								listchannel.send('p!pokemon ' + listpages);
								listpages -= 1;
							}else{
								listactive = false;
							};
						});
					}else if(listfirst == false){
						sleep(3000, function() {
						   if(listpages >= 1){
								listchannel.send('p!pokemon ' + listpages);
								listpages -= 1;
								listfinished = msg.embeds[0].description + "\n" + listfinished;
							}else{
								listactive = false;
								listfinished = msg.embeds[0].description + "\n" + listfinished;
								listarray = listfinished.split("\n");
								listarray.splice(-1, 1);
								listobj = {array:listarray, string:listfinished};
								jsonfile.writeFile('./listeprive.json', listobj, function (err) {
									//console.error(err)
								});
								console.log(colors.blue('Your pokemon list has been successfully loaded !'));
							};
						});
					};
				};
			}else if(msg.content.includes('Congratulations') && msg.mentions.users.exists('username', client.user.username)){
				PokeName2 = new String();
				for(k = 0; k < (array.length); k++){
					if(msg.content.includes(array[k])){
						PokeName2 = array[k];
						console.log(colors.blue('I caught ' + PokeName2));
						listobj['array'].push(PokeName2 + '|' + msg.content.replace(/\D+/g, '') + '|' + listarray.length-1);
						listarray.push(PokeName2 + '|' + msg.content.replace(/\D+/g, '') + '|' + listarray.length-1);
						jsonfile.writeFile('./listeprive.json', listobj, function (err) {
							//console.error(err)
						});
						console.log(colors.blue('Your pokemon list has been successfully loaded !'));
						break;
					};
				};
			}else if(msg.content == 'p^list'){
				listactive = true;
				listfirst = true;
				listchannel = msg.channel;
				listchannel.send('p!pokemon');
			}else if(msg.content == 'p^register'){
				channeltalk = msg.channel;
				var objoption = {token:token,delay:delay,autocatcher:autocatcher,noduplicate:noduplicate,channeltalk:channeltalk.id};
				jsonfile.writeFile(conf, objoption, function (err) {});
				console.log(colors.yellow('Registered channel : ' + msg.channel.name + ' as the textable channel'));
				msg.delete();
			};
		};
		
	});
		
	client.login(token);
};

//INITIALISATION DES CONFIG

const scanFolder = require("scan-folder");
const conf = 'config.json';
const https = require('https');
const request = require('request');
const wait = require('wait-for-stuff');
const Discord = require('discord.js');
const jsonfile = require('jsonfile');
const math = require('mathjs');
const fs = require('fs');
const client = new Discord.Client();
const randomInt = require('random-int');
const md5Hex = require('md5-hex');
const colors = require('colors/safe');
const express = require('express');
const app = express();
var listactive;
var listfirst;
var listpages;
var listfinished;
var listarray;
var array = fs.readFileSync("./pokemonlist.json", "utf-8").split(",");
var listobj;
var listchannel;
var SpamTimeout;
var spamactive = false;
var selected = new Object;
selected['number'] = undefined;
selected['name']= undefined;

app.use(express.static('assets'));

app.get('/', function (req, res) {
	fs.readFile('./index.html', 'utf8', function(err, text){
		if(listobj.hasOwnProperty('array')){
			res.send('<script>spamactive='+spamactive+'; token="'+token+'"; selected={number:"'+selected['number']+'",name:"'+selected['name']+'"}; textchannel="'+channeltalk+'"; autocatcher='+autocatcher+'; noduplicate='+noduplicate+'; listarray="'+listobj["array"].toString()+'".split(",")</script>'+ text);
		}else{
			res.send('<script>spamactive='+spamactive+'; token="'+token+'"; selected={number:"'+selected['number']+'",name:"'+selected['name']+'"}; textchannel="'+channeltalk+'"; autocatcher='+autocatcher+'; noduplicate='+noduplicate+';</script>'+ text);
		}
	});
});

app.get('/aca-true', function (req, res) {
	console.log(colors.yellow('Auto-catch activated !'));
	res.redirect('/');
	autocatcher = true;
	var objoption = {token:token,delay:delay,autocatcher:autocatcher,noduplicate:noduplicate,channeltalk:channeltalk};
	jsonfile.writeFile(conf, objoption, function (err) {});
});

app.get('/aca-false', function (req, res) {
	console.log(colors.yellow('Auto-catch disabled !'));
	res.redirect('/');
	autocatcher = false;
	var objoption = {token:token,delay:delay,autocatcher:autocatcher,noduplicate:noduplicate,channeltalk:channeltalk};
	jsonfile.writeFile(conf, objoption, function (err) {});
});

app.get('/noduplicate-true', function (req, res) {
	console.log(colors.yellow('I will catch every pokemons !'));
	res.redirect('/');
	noduplicate = false;
	var objoption = {token:token,delay:delay,autocatcher:autocatcher,noduplicate:noduplicate,channeltalk:channeltalk};
	jsonfile.writeFile(conf, objoption, function (err) {});
});

app.get('/noduplicate-false', function (req, res) {
	console.log(colors.yellow('I won\'t catch the duplicates pokemons !'));
	res.redirect('/');
	noduplicate = false;
	var objoption = {token:token,delay:delay,autocatcher:autocatcher,noduplicate:noduplicate,channeltalk:channeltalk};
	jsonfile.writeFile(conf, objoption, function (err) {console.log(err);});
});

app.get('/action', function (req, res) {
	res.redirect('/');
	if(req.query['action'] == 'release'){
		if(typeof channeltalk != 'undefined'){
			channeltalk.send('p!release ' + req.query['number'])
				.catch(function(){console.log(colors.blue('Successfully released pokemon number ' + req.query['number']))})
				.then(function(){
					sleep(3000, function(){
						//channeltalk.send('p!confirm');
						console.log(colors.blue('Successfully released pokemon number ' + req.query['number']));
					});
					
				});
		}else{
			console.log(colors.red('You didn\'t set any textable channel ! Use p^register in a channel where I can talk to the bot !'));
		};
	}else if(req.query['action'] == 'select'){
		if(typeof channeltalk != 'undefined'){
			selected = {number:req.query['number'],name:req.query['name']};
			channeltalk.send('p!select ' + req.query['number']);
		}else{
			console.log(colors.red('You didn\'t set any textable channel ! Use p^register in a channel where I can talk to the bot !'));
		};
	}else if(req.query['action'] == 'nickname'){
		if(typeof channeltalk != 'undefined'){
			selected = {number:req.query['number'],name:req.query['name']};
			channeltalk.send('p!nickname ' + req.query['nickname']);
		}else{
			console.log(colors.red('You didn\'t set any textable channel ! Use p^register in a channel where I can talk to the bot !'));
		};
	}else if(req.query['action'] == 'tokenchange'){
		var objoption = {token:req.query['token'],delay:delay,autocatcher:autocatcher,noduplicate:noduplicate,channeltalk:channeltalk};
		jsonfile.writeFile(conf, objoption, function (err) {console.log(err);});
		console.log(colors.red('Restart the bot to apply the new token !'));
	}else if(req.query['action'] == 'spamtrue'){
		if(typeof channeltalk != 'undefined'){
			spamactive = true;
			SpamStart(req.query['message'],req.query['interval']);
		}else{
			console.log(colors.red('You didn\'t set any textable channel ! Use p^register in a channel where I can talk to the bot !'));
		};
	}else if(req.query['action'] == 'spamfalse'){
		spamactive = false;
		SpamStop();
	};
});

app.listen(3000, function () {
  //console.log('Example app listening on port 3000!')
});

fs.readFile('./listeprive.json', 'utf8', function (err,data) {
	if(err){
		listobj = new Object;
	}else{
		listobj = jsonfile.readFileSync('./listeprive.json');
	}
	if(listobj.hasOwnProperty('array') && listobj.hasOwnProperty('string')){
		console.log(colors.yellow("Your pokemon list has been included !"));
	}else{
		listobj = new Object;
		console.log(colors.red("Your pokemon list hasn't been included !"));
		console.log(colors.red("Type p^list in a calm channel to register your list."));
	}
});

function loadVariable(file){
	obj = jsonfile.readFileSync(file)
	token = obj["token"];
	delay = obj["delay"];
	autocatcher = obj["autocatcher"];
	noduplicate = obj["noduplicate"];
	channeltalk = obj["channeltalk"];
	console.log(colors.yellow("\n\n####### CONFIGURATION #######"));
	console.log(colors.yellow("token = " + obj["token"]));
	console.log(colors.yellow("Connect to localhost:3000 to change the configuration"));
	console.log(colors.yellow("Autocatch : " + autocatcher));
	console.log(colors.yellow("No Duplicate : " + noduplicate));
	console.log(colors.yellow("If you haven't, register a channel where I can talk to the bot with p^register"));
	console.log(colors.yellow("####### END OF CONFIG #######\n\n"));
}

fs.readFile(conf, 'utf8', function (err,data) {
	if (err) {
		fs.closeSync(fs.openSync(conf, 'w'));
		console.log(`There is a little problem with the config file :c`);
		var option = {token:"TOKENICI",delay:3000,autocatcher:false,noduplicate:true};
		jsonfile.writeFile(conf, listobj, function (err) {});
	}else{
		loadVariable(conf);
		bot();
	};
});