var registerCommonKeys = require('./registerCommonKeys');
var tankGUIUpdateAction = require('./gui/tankGUIUpdateAction');

var speedUp = function (movement, config) {
	if (movement.speed < 65) {
		movement.speed = 65;
	} else if (movement.speed < 110) {
		movement.speed += 0.5;
	} else {
		movement.speed += 1;
	}

	if (movement.speed > config.sp) {
		movement.speed = config.sp;
	};
}

module.exports = function(ollie, config, $) {
	var keys = {
		w:{},
		a:{},
		s:{},
		d:{},
		tab:{},
		shift:{},
		space:{}
	}

	var movement = {speed: 0};

	var runner = function() {
		registerCommonKeys(config, $);
		
		$(document).keydown(function(event) {
			switch(event.keyCode) {
				case 87:
					//w
					if (!keys.w.ticked) {
						movement.updown = 'Forward';
					}
					keys.w.ticked = true;
					break;
				case 65:
					//a
					if (!keys.a.ticked) {
						movement.leftright = 'left';
					}
					keys.a.ticked = true;
					break;
				case 83:
					//s
					if (!keys.s.ticked) {
						movement.updown = 'Reverse';
					}
					keys.s.ticked = true;
					break;
				case 68:
					//d
					if (!keys.d.ticked) {
						movement.leftright = 'right';
					}
					keys.d.ticked = true;
					break;
				case 32:
					//space
					if (!keys.space.ticked) {
						movement.emergencyBrake = true;
					}
					keys.space.ticked = true;
					break;
			}
		});

		$(document).keyup(function(event) {
			switch(event.keyCode) {
				case 87:
					//w
					keys.w.ticked = false;
					movement.updown = false;
					break;
				case 65:
					//a
					keys.a.ticked = false;
					movement.leftright = false;
					break;
				case 83:
					//s
					keys.s.ticked = false;
					movement.updown = false;
					break;
				case 68:
					//d
					keys.d.ticked = false;
					movement.leftright = false;
					break;
				case 32:
					//space
					keys.space.ticked = false;
					movement.emergencyBrake = false;
					break;
			}
		});
	}

	var intervalFunction = function() {
		if (movement.emergencyBrake) {
			ollie.setRawMotorValues('Brake',255,'Brake',255, function(){
				movement.speed = 0;
			});

			return tankGUIUpdateAction(movement, 'brake');
		}

		if (movement.updown || movement.leftright) {
			movement.bosta_mi = false;
			speedUp(movement, config);
			var lp = Math.floor(movement.speed), rp = Math.floor(movement.speed);
			if (movement.leftright && movement.updown) {
				switch(movement.leftright) {
					case 'left':
						rp = Math.floor(rp + movement.speed/2.2);
						lp = Math.floor(lp - movement.speed/2.2);
						break;
					case 'right': 
						lp = Math.floor(lp + movement.speed/2.2);
						rp = Math.floor(rp - movement.speed/2.2);
						break;
				}
				if (lp > 255) {
					lp = 255;
				} else if (lp < 0) {
					lp = 0;
				}
				if (rp > 255) {
					rp = 255;
				} else if (rp < 0) {
					rp = 0;
				}
				ollie.setRawMotorValues(movement.updown,lp,movement.updown,rp);
			} else if (movement.leftright) {
				switch(movement.leftright) {
					case 'left':
						var rm = 'Forward';
						var lm = 'Reverse';
						break;
					case 'right': 
						var rm = 'Reverse';
						var lm = 'Forward';
						break;
				}
				lp = rp = Math.floor((movement.speed/5)*4);
				ollie.setRawMotorValues(lm,lp,rm,rp);
			} else if (movement.updown) {
				ollie.setRawMotorValues(movement.updown,lp,movement.updown,rp);
			}
		} else if (!movement.bosta_mi) {
			ollie.setRawMotorValues('Brake',0,'Brake',0, function(){
				movement.bosta_mi = true;
			});
			movement.speed = 0;
		} else {
		}
		return tankGUIUpdateAction(movement);
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