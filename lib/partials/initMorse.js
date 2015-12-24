var registerCommonKeys = require('./registerCommonKeys');
var morseGUITypeMorseAction = require('./gui/morseGUIUpdateAction').typeMorse;
var morseGUIMainAction = require('./gui/morseGUIUpdateAction').main;
var events = require('events');

var waitTime = 250; // default value , a global would update it soon
var defaultColor = 0xFFFFFF;

// copied from http://freenet.msp.mn.us/people/calguire/morse.html (removed space)
var morseMap = {
	'A': '.-',
	'B': '-...',
	'C': '-.-.',
	'D': '-..',
	'E': '.',
	'F': '..-.',
	'G': '--.',
	'H': '....',
	'I': '..',
	'J': '.---',
	'K': '-.-',
	'L': '.-..',
	'M': '--',
	'N': '-.',
	'O': '---',
	'P': '.--.',
	'Q': '--.-',
	'R': '.-.',
	'S': '...',
	'T': '-',
	'U': '..-',
	'V': '...-',
	'W': '.--',
	'X': '-..-',
	'Y': '-.--',
	'Z': '--..',
	'Á': '.--.-', // A with acute accent
	'Ä': '.-.-',  // A with diaeresis
	'É': '..-..', // E with acute accent
	'Ñ': '--.--', // N with tilde
	'Ö': '---.',  // O with diaeresis
	'Ü': '..--',  // U with diaeresis
	'1': '.----',
	'2': '..---',
	'3': '...--',
	'4': '....-',
	'5': '.....',
	'6': '-....',
	'7': '--...',
	'8': '---..',
	'9': '----.',
	'0': '-----',
	',': '--..--',  // comma
	'.': '.-.-.-',  // period
	'?': '..--..',  // question mark
	';': '-.-.-',   // semicolon
	':': '---...',  // colon
	'/': '-..-.',   // slash
	'-': '-....-',  // dash
	"'": '.----.',  // apostrophe
	'()': '-.--.-', // parenthesis
	'_': '..--.-',  // underline
	'@': '.--.-.'
};

//Functions
var insertCommArr = function (morse, commQuery) {
	if (morse === "word end") {
		commQuery.push("word end");
		return 0;
	}

	var morseArr = morse.split("");
	for (var j = 0; j < morseArr.length; j++) {
		var c = morseArr[j];
		switch (c) {
			case ".":
				commQuery.push("short");
				break;
			case "-":
				commQuery.push("long");
				break;
		}
	};
	commQuery.push("char end");
}

var parseCommQuery = function (commQuery, ollie , emitter, idle) {
	var comm = commQuery[0];
	if (typeof comm === "undefined") { // now this is implemented better but keeping it for safety // love maa english
		idle.idle = true;
		return 0;
	} else {
		idle.idle = false;
	}
	switch (comm) {
		case "short":
			shortBlink(ollie,emitter);
			break;
		case "long":
			longBlink(ollie,emitter);
			break;
		case "word end":
			endWord(ollie,emitter);
			break;
		case "char end":
			endChar(ollie,emitter);
			break;
	}
	commQuery.shift();
}

var shortBlink = function (ollie, emitter) {
	ollie.color(defaultColor, function() {
		ollie.setBackLed(255, function() {
			setTimeout(function() {
				ollie.color(0x000000,function() {
					ollie.setBackLed(0, function() {
						morseGUITypeMorseAction(".");
						setTimeout(function() { // wait time between parts of a character is one unit
							emitter.emit("sent");
						}, waitTime);
					})
				})
			},waitTime);
		});
	});
}

var longBlink = function (ollie, emitter) {
	ollie.color(defaultColor, function() {
		ollie.setBackLed(255, function() {
			setTimeout(function() {
				ollie.color(0x000000,function() {
					ollie.setBackLed(0, function() {
						morseGUITypeMorseAction("-");
						setTimeout(function() { // wait time between parts of a character is one unit
							emitter.emit("sent");
						}, waitTime);
					})
				})
			},waitTime*3);
		});
	});
}

var endChar = function (ollie, emitter) {
	setTimeout(function() {
				emitter.emit("sent");
				morseGUITypeMorseAction(" "); //a space
	},waitTime*3);
}

var endWord = function (ollie, emitter) {
	setTimeout(function() {
				emitter.emit("sent");
				morseGUITypeMorseAction("|"); // an interrogation
	},waitTime*7);
}

module.exports = function(ollie, config, $) {
	var clearFunction = function(){
		console.log("Morse was never run")
	}

	var defaultColor = false || defaultColor; // will provide the value of getColor

	var runner = function() {
		registerCommonKeys(config, $);
		waitTime = config.morseWaitTime || waitTime;

		var commQuery = [];
		var codeEmitter = new events.EventEmitter();
		var idle = {idle:true}; // bugfix // ahh those references

		//events
		codeEmitter.on('sent',function() { // process next char after a char is sent
			if (commQuery.length === 0) {
				idle.idle = true;
				morseGUITypeMorseAction("EoS"); //A problem has arisen, this code gives EndOfStream vefore the last code, but it doesn't matter actually (I would fix this if I have time)
				return 0;
			}
			parseCommQuery(commQuery, ollie, codeEmitter, idle);
		})

		codeEmitter.on('got a morse', function(commQuery) { // bu once olmak zorunda(ydı idle ile çözdüm galiba)
			if (idle.idle) {
				parseCommQuery(commQuery, ollie, codeEmitter, idle);
			}
		})

		//gui binding, oh man... this gui binding is amazing, isn't it
		clearFunction = morseGUIMainAction(function(string){ // sendMorseFunction // I know I am using globals, do not kill me OK? //clearFunction is not that function, morseGUIblablaCtipon returns the clear mubmle jumbles
			if (string === "") {
				morseGUITypeMorseAction("EoS");
				return 1;
			}

			for (var i = 0; i < string.length; i++) {
				var chara = string[i].toUpperCase();
				if (morseMap[chara]) {
					var morse = morseMap[chara];
					insertCommArr(morse, commQuery);
					codeEmitter.emit('got a morse', commQuery) //send first chars, this will emit lots of chars but no problem, the event will only handle the first one

				} else if (chara === " ") {
					var morse = "word end";
					insertCommArr(morse, commQuery);
					codeEmitter.emit('got a morse', commQuery) //send first chars
				} else {
					console.log("couldnt identify, sending ?");

					var morse = morseMap["?"];
					insertCommArr(morse, commQuery);
					codeEmitter.emit('got a morse', commQuery) //send first chars
				}
			};
		}, function() { // abortFunction
			commQuery = []; // reset commQuery
		})
	};

	var ret = function() {
		this.runMe = function(){
			runner();
		}

		this.clearMe = function() {
			clearFunction(); //Don't you love globals :F
		}
	}

	return new ret();
}