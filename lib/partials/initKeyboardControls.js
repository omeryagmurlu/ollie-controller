var registerCommonKeys = require('./registerCommonKeys');
var keyboardGUIUpdateAction = require('./gui/keyboardGUIUpdateAction');

var motor = {
	OFF: 0x00,
	FORWARD: 0x01,
	REVERSE: 0x02,
	BRAKE: 0x03
}

module.exports = function(ollie, config, $) {
	var keys = {
		w:{},
		a:{},
		s:{},
		d:{},
		UP:{},
		DOWN:{},
		RIGHT:{},
		LEFT:{},
		tab:{},
		shift:{},
		space:{},
	}

	var movement = {heading:0, speed:0, speedSlowDownIntervalId: []};
	movement.speedSlowDownMethod = function() {
		movement.speed--;
		if (movement.speed < 0) {
			movement.speed = 0;
		}
	}

	var runner = function() {
		registerCommonKeys(config, $);

		$(document).keydown(function(event) {
			switch(event.keyCode) {
				case 87:
					//w
					keys.w.ticked = true;
					break;
				case 65:
					//a
					keys.a.ticked = true;
					break;
				case 83:
					//s
					keys.s.ticked = true;
					break;
				case 68:
					//d
					keys.d.ticked = true;
					break;
				case 38:
					//UP
					keys.UP.ticked = true;
					break;
				case 37:
					//LEFT
					keys.LEFT.ticked = true;
					break;
				case 40:
					//DOWN
					keys.DOWN.ticked = true;
					break;
				case 39:
					//RIGHT
					keys.RIGHT.ticked = true;
					break;
				case 16:
					//shift
					keys.shift.ticked = true;
					break;
			}
		});

		$(document).keyup(function(event) {
			switch(event.keyCode) {
				case 87:
					//w
					keys.w.ticked = false;
					keys.w.newKeyUp = true;
					break;
				case 65:
					//a
					keys.a.ticked = false;
					break;
				case 83:
					//s
					keys.s.ticked = false;
					break;
				case 68:
					//d
					keys.d.ticked = false;
					break;
				case 38:
					//UP
					keys.UP.ticked = false;
					keys.UP.newKeyUp = true;
					break;
				case 37:
					//LEFT
					keys.LEFT.ticked = false;
					keys.LEFT.newKeyUp = true;
					break;
				case 40:
					//DOWN
					keys.DOWN.ticked = false;
					keys.DOWN.newKeyUp = true;
					break;
				case 39:
					//RIGHT
					keys.RIGHT.ticked = false;
					keys.RIGHT.newKeyUp = true;
					break;
				case 16:
					//shift
					keys.shift.ticked = false;
					break;
			}
		});
	}

	var intervalFunction = function() {
		if (keys.w.ticked) {
			if (movement.speedSlowDownIntervalId[0]) {
				for (var i = movement.speedSlowDownIntervalId.length - 1; i >= 0; i--) {
					clearInterval(movement.speedSlowDownIntervalId[i]);
					movement.speedSlowDownIntervalId.pop();
				};
			}
			if (movement.speed < 50) {  // fast accel
				movement.speed += 7;
			} else {
				movement.speed += 5;
			}
			if (movement.speed > config.sp) {
				movement.speed = config.sp;
			};
		} else if (keys.w.newKeyUp) {
			keys.w.newKeyUp = false;
			if (movement.speedSlowDownIntervalId[0]) {                 // get rid of the intervals who bypassed somehow ticked before adding new ones
				for (var i = movement.speedSlowDownIntervalId.length - 1; i >= 0; i--) {
					clearInterval(movement.speedSlowDownIntervalId[i]);
					movement.speedSlowDownIntervalId.pop();
				};
			}
			movement.speedSlowDownIntervalId[movement.speedSlowDownIntervalId.length] = setTimeout(function() {  // wait a while before making the speed fall
				movement.speedSlowDownIntervalId[movement.speedSlowDownIntervalId.length] = setInterval(movement.speedSlowDownMethod, 100);
			},2000);
		}
		if (keys.d.ticked) {
			movement.heading+= 10;
			if (movement.heading > 360) {
				movement.heading = 10;
			};
		}
		if (keys.s.ticked) {
			movement.speed-= 10;
			if (movement.speed < 0) {
				movement.speed = 0;
			};
		}
		if (keys.a.ticked) {
			movement.heading-= 10;
			if (movement.heading < 0) {
				movement.heading = 350;
			};
		}

		var f = -1;     // winkel emulation
		if (keys.UP.ticked) {
			f = 0;
		}
		if (keys.DOWN.ticked) {
			f = 180;
		}
		if (keys.UP.ticked || keys.DOWN.ticked) {
			if (keys.UP.ticked) {
				if (keys.RIGHT.ticked) {
					f += 45;
				}
				if (keys.LEFT.ticked) {
					f -= 45;
				}
			} else {
				if (keys.RIGHT.ticked) {
					f -= 45;
				}
				if (keys.LEFT.ticked) {
					f += 45;
				}
			}
		} else {
			if (keys.RIGHT.ticked) {
				f += 90;
			}
			if (keys.LEFT.ticked) {
				f -= 90;
			}
		}

		// f manipulation and simplification
		if (f < 0) {
			f = 360+f;
		}
		f =  Math.round(f/45);
		movement.lm = motor.OFF, movement.rm = motor.OFF, movement.lp = 255, movement.rp = 255;

		if ( !(keys.DOWN.ticked || keys.UP.ticked || keys.RIGHT.ticked || keys.LEFT.ticked || ( keys.DOWN.newKeyUp || keys.UP.newKeyUp || keys.RIGHT.newKeyUp || keys.LEFT.newKeyUp )) ) { // returns false if one of them is ticked
			if (keys.w.ticked || keys.a.ticked || keys.s.ticked || keys.d.ticked || (movement.speed > 0)) {
				ollie.roll(movement.speed, movement.heading, config.mode);
			}
		} else {
			keys.DOWN.newKeyUp = keys.UP.newKeyUp = keys.RIGHT.newKeyUp = keys.LEFT.newKeyUp = false;

			switch(f){
				case 0:
					movement.lm = motor.FORWARD;
					movement.rm = motor.FORWARD;
					break;
				case 1:
					movement.lm = motor.REVERSE;
					movement.rm = motor.FORWARD;
					movement.lp = Math.floor(movement.lp / 2);
					break;
				case 2:
					movement.lm = motor.REVERSE;
					movement.rm = motor.FORWARD;
					break;
				case 3:
					movement.lm = motor.REVERSE;
					movement.rm = motor.FORWARD;
					movement.rp = Math.floor(movement.rp / 2);
					break;
				case 4:
					movement.lm = motor.REVERSE;
					movement.rm = motor.REVERSE;
					break;
				case 5:
					movement.lm = motor.FORWARD;
					movement.rm = motor.REVERSE;
					movement.lp = Math.floor(movement.lp / 2);
					break;
				case 6:
					movement.lm = motor.FORWARD;
					movement.rm = motor.REVERSE;
					break;
				case 7:
					movement.lm = motor.FORWARD;
					movement.rm = motor.REVERSE;
					movement.rp = Math.floor(movement.rp / 2);
					break;
				case 8:
					movement.lm = motor.BRAKE;
					movement.rm = motor.BRAKE;
					break;
			}
			ollie.setRawMotors({
				lmode: movement.lm,
				lpower: movement.lp,
				rmode: movement.rm,
				rpower: movement.rp
			});
		}

		keyboardGUIUpdateAction(movement.speed, movement.heading);
	}

	var ret = function() {
		this.runMe = function(){
			runner();
			this.interval = setInterval(intervalFunction,30);
		}

		this.clearMe = function() {
			clearInterval(this.interval);
		}
	}

	return new ret();
}