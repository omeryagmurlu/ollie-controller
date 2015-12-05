// Mixing jQuery and Node.js code in the same file? Yes please!

$(function(){
	'use strict'
	var commandQueue = [];
	var Cylon = require('cylon');
	var isMoving = 0;
	var turn = 0;
	function initHTML(){
		function queueCommand(obj){
			commandQueue.push(obj);
		}
		function handleJoystick(){
			heading = Math.floor(Math.abs((Math.atan2(joystick.deltaX(), joystick.deltaY())* (180/Math.PI))-180));
			speed = Math.floor(Math.sqrt((joystick.deltaX() * joystick.deltaX()) + (joystick.deltaY() * joystick.deltaY())));
			queueCommand({
				command:"roll",
				arg:[speed,heading,1]
			});
		}
		function handleColorButton(){
			queueCommand({
				command:"setRGB",
				arg:["0x" + document.getElementById('collar').value]
			});
		}
		// init
		var heading, speed, isDown, isOver;
		var locTurn = 0;
		var joystick = new VirtualJoystick({
			container:document.getElementById('joystickContext'),
			mouseSupport: true,
			limitStickTravel: true,
			stickRadius	: 255
		});
		document.getElementById('colButton').addEventListener('click',function(){
			handleColorButton();
		})
		document.getElementById('TestButton1').addEventListener('click',function(){
			queueCommand({
				command:"setRandomColor",
				arg:[]
			});		
		})
		document.getElementById('TestButton2').addEventListener('click',function(){
			queueCommand({
				command:"setDataStreaming",
				arg:[["velocity"]]
			});		
		})
		document.getElementById('TestButton3').addEventListener('click',function(){
			queueCommand({
				command:"startGettingNotifications",
				arg:[]
			});	
		})
		function joyInterval(){
			if (isDown && isOver){
				console.log('joystick');
				handleJoystick();
				var outputEl = document.getElementById('result');
				outputEl.innerHTML	= '<b>Result:</b> '+' heading:'+heading +' speed:'+speed;
			}
			setTimeout(function(){joyInterval()},50);
		};joyInterval()
		document.getElementById('joystickContext').addEventListener('mouseover', function(){
			isOver = true;
		})
		document.getElementById('joystickContext').addEventListener('mouseout', function(){
			isOver = false;
		})
		document.getElementById('joystickContext').addEventListener('mousedown', function(){
			isDown = true;
		})
		document.getElementById('joystickContext').addEventListener('mouseup', function(){
			console.log("stopper")
			isDown = false;
			queueCommand({
				command:"stop",
				arg:[function(){}]
			});
		})
	}

	function processCommand(my){
		var command = commandQueue;
		if (typeof command[0] === "undefined"){
			console.log("idle")
			if(isMoving !== 0){
				my.ollie.stop();
				isMoving --;
				console.log("brake");
			}
			return 0;
		}
		for ( var i=0; i<command.length; i++){
			console.log(command[i].command+": "+command[i].arg+"processing "+i)
			my.ollie[command[i].command].apply(null, command[i].arg);
		}
		isMoving = 4;
		commandQueue = []
		return 0;
	}
	
	var myRobot = Cylon.robot({
		connections: {
			bluetooth: { adaptor: 'central', uuid: 'ef66143e996d', module: 'cylon-ble' }
		},

		devices: {
			battery: { driver: 'ble-battery-service' },
			deviceInfo: { driver: 'ble-device-information' },
			generic: { driver: 'ble-generic-access' },
			ollie: { driver: 'ollie' }
		},

		display: function(err, data) {
			if (err) {
				console.log("Error:", err);
			} else {
				console.log("Data:", data);
			}
		},

		work: function(my) {
			my.ollie.devModeOn(function(){
				console.log('dev mode on');
				initHTML()
				setInterval(function(){
					processCommand(my);
					turn ++;
				},500);
			});

			setTimeout(function(){
				console.log('forcing wake');
				my.ollie.wake(function(){});
			},1000)

			setTimeout(function(){
				my.ollie.setNotify();
			},10000)

			console.log('tester');
			my.ollie.on("notification", function(data) {
		      my.ollie.setRGB("0xFF0000");
		      console.log("Notification: "+data);
		    });
		}
	}).start();
});
