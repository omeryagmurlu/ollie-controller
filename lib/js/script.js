// Mixing jQuery and Node.js code in the same file? Yes please!

$(function(){
'use strict'
	var commandQueue = [];

	var os = require('os');
	var fs = require('fs');
	function sendMsg(msg){
		if(msg !== "[]"){
			fs.writeFile("toNode", msg, function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("Send File: "+msg);
			});
		} else {
			console.log("Empty")
		}
	}
	function readMsg(){
		return fs.readFileSync('toNode', 'utf8');
	}
	function queueCommand(obj){
		commandQueue.push(obj);
	}
	function sendCommands(){
		sendMsg(JSON.stringify(commandQueue));
		commandQueue = [];
		setTimeout(function(){sendCommands()},0);
	}
	// init
	var heading, speed, isDown1, isOver1, isOver2, isDown2;
	var joystick1 = new VirtualJoystick({
		container:document.getElementById('joystick1'),
		mouseSupport: true,
		stationaryBase: true,
        baseX: 255,
        baseY: 255,
		limitStickTravel: true,
		stickRadius: 255
	});
	var joystick2 = new VirtualJoystick({
		container:document.getElementById('joystick2'),
		strokeStyle:"rgba(255,219,184,1)",
		mouseSupport: true,
		limitStickTravel: true,
		stickRadius: 255
	});
	document.getElementById('colButton').addEventListener('click',function(){
		queueCommand({
			command:"setRGB",
			arg:["0x" + document.getElementById('collar').value]
		});
	})
	document.getElementById('TestButton1').addEventListener('click',function(){
		queueCommand({
			command:"halt",
			arg:[]
		});		
	})
	document.getElementById('TestButton2').addEventListener('click',function(){
		queueCommand({
			command:"startCalibration",
			arg:[]
		});		
	})
	document.getElementById('TestButton3').addEventListener('click',function(){
		queueCommand({
			command:"finishCalibration",
			arg:[]
		});	
	})
	document.getElementById('TestButton4').addEventListener('click',function(){
		queueCommand({
			command:"setRotationRate",
			arg:[parseInt(document.getElementById('TestInput4').value)]
		});
	})
	document.getElementById('TestButton5').addEventListener('click',function(){
		queueCommand({
			command:"setBackLED",
			arg:[parseInt(document.getElementById('TestInput5').value)]
		});
	})
	document.getElementById('TestButton6').addEventListener('click',function(){
		
	})
	document.getElementById('TestButton7').addEventListener('click',function(){
		
	})
	document.getElementById('TestButton8').addEventListener('click',function(){
		
	})
	document.getElementById('TestButton9').addEventListener('click',function(){
		
	})
	document.getElementById('TestButtonComm').addEventListener('click',function(){
		queueCommand({
			command:document.getElementById('TestInputComm').value,
			arg:JSON.parse(document.getElementById('TestInputArgs').value)
		});
	})
	function joy1Interval(){
		if (isDown1 && isOver1){
			heading = Math.floor(Math.abs((Math.atan2(joystick1.deltaX(), joystick1.deltaY())* (180/Math.PI))-180));
			speed = Math.floor(Math.sqrt((joystick1.deltaX() * joystick1.deltaX()) + (joystick1.deltaY() * joystick1.deltaY())));
			queueCommand({
				command:"roll",
				arg:[speed,heading,1]
			});
			var outputEl = document.getElementById('result');
			outputEl.innerHTML	= '<b>Result:</b> '+' heading:'+heading +' speed:'+speed;
		}
		setTimeout(function(){joy1Interval()},50);
	};joy1Interval()
	function joy2Interval(){
		if (isDown2 && isOver2){
			var winkel = Math.floor(Math.abs((Math.atan2(joystick2.deltaX(), joystick2.deltaY())* (180/Math.PI))-180));
			var abstand = Math.floor(Math.sqrt((joystick2.deltaX() * joystick2.deltaX()) + (joystick2.deltaY() * joystick2.deltaY())));
			var f = Math.round(winkel/45);
			var MotorOff = 0x00, MotorForward = 0x01, MotorReverse = 0x02, MotorBrake = 0x03, MotorIgnore = 0x04;
			var lm = MotorOff, rm = MotorOff, lp = abstand, rp = abstand;
			if (abstand == 0) {f = -1;}
			switch(f){
				case -1:
					break;
				case 0:
				case 8:
					lm = MotorForward;
					rm = MotorForward;
					break;
				case 1:
					lm = MotorReverse;
					rm = MotorForward;
					lp = Math.floor(lp / 2);
					break;
				case 2:
					lm = MotorReverse;
					rm = MotorForward;
					break;
				case 3:
					lm = MotorReverse;
					rm = MotorForward;
					rp = Math.floor(rp / 2);
					break;
				case 4:
					lm = MotorReverse;
					rm = MotorReverse;
					break;
				case 5:
					lm = MotorForward;
					rm = MotorReverse;
					lp = Math.floor(lp / 2);
					break;
				case 6:
					lm = MotorForward;
					rm = MotorReverse;
					break;
				case 7:
					lm = MotorForward;
					rm = MotorReverse;
					rp = Math.floor(rp / 2);
					break;
			}
			queueCommand({
				command:"setRawMotorValues",
				arg:[lm,lp,rm,rp]
			});
			console.log(winkel,abstand,f);
		}
		setTimeout(function(){joy2Interval()},50);
	};joy2Interval()
	document.getElementById('joystick1').addEventListener('mouseover', function(){
		isOver1 = true;
	})
	document.getElementById('joystick1').addEventListener('mouseout', function(){
		isOver1 = false;
	})
	document.getElementById('joystick1').addEventListener('mousedown', function(){
		isDown1 = true;
	})
	document.getElementById('joystick1').addEventListener('mouseup', function(){
		console.log("stopper")
		isDown1 = false;
		queueCommand({
			command:"stop",
			arg:[function(){}]
		});
	})
	document.getElementById('joystick2').addEventListener('mouseover', function(){
		isOver2 = true;
	})
	document.getElementById('joystick2').addEventListener('mouseout', function(){
		isOver2 = false;
	})
	document.getElementById('joystick2').addEventListener('mousedown', function(){
		isDown2 = true;
	})
	document.getElementById('joystick2').addEventListener('mouseup', function(){
		isDown2 = false;
		queueCommand({
			command:"stop",
			arg:[function(){}]
		});
	})
	sendCommands();
});
