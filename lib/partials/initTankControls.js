var registerCommonKeys = require('./registerCommonKeys');

module.exports = function(ollie, config, $) {
	var keys = {
		w:{},
		a:{},
		s:{},
		d:{},
		tab:{},
		shift:{},
		space:{},
	}

	var movement = {};

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
				case 16:
					//shift
					if (!keys.shift.ticked) {
						
					}
					keys.shift.ticked = true;
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
				case 16:
					//shift
					keys.shift.ticked = false;
					break;
			}
		});
	}

	var intervalFunction = function() {
		if (movement.updown || movement.leftright) {
			movement.braked = false;
			var lp = config.sp, rp = config.sp;
			if (movement.leftright && movement.updown) {
				switch(movement.leftright) {
					case 'left':
						rp = rp + config.sp/2;
						lp = lp - config.sp/2;
						break;
					case 'right': 
						lp = lp + config.sp/2;
						rp = rp - config.sp/2;
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
				lp = rp = Math.floor((config.sp/5)*4);
				ollie.setRawMotorValues(lm,lp,rm,rp);
			} else if (movement.updown) {
				ollie.setRawMotorValues(movement.updown,lp,movement.updown,rp);
			}
		} else if (!movement.braked) {
			ollie.setRawMotorValues('Brake',255,'Brake',255);
			movement.braked = true;
		}
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