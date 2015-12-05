var registerCommonKeys = require('./registerCommonKeys');

module.exports = function(ollie, config, $) {  //returns a function to make use of all of this
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
		strokeStyle:"rgba(250,121,0,1)",
		mouseSupport: true,
		limitStickTravel: true,
		stickRadius: 255
	});

	var joy1Interval = function(){
		if (joystick1.isDown && joystick1.isOver){
			var heading, speed;
			heading = Math.floor(Math.abs((Math.atan2(joystick1.deltaX(), joystick1.deltaY())* (180/Math.PI))-180));
			speed = Math.floor(Math.sqrt((joystick1.deltaX() * joystick1.deltaX()) + (joystick1.deltaY() * joystick1.deltaY())));
			if (speed > config.sp) {
				speed = config.sp;
			}
			ollie.roll(speed,heading,config.mode);
		}
	};

	var joy2Interval = function(){
		if (joystick2.isDown && joystick2.isOver){
			var winkel = Math.floor(Math.abs((Math.atan2(joystick2.deltaX(), joystick2.deltaY())* (180/Math.PI))-180));
			var abstand = Math.floor(Math.sqrt((joystick2.deltaX() * joystick2.deltaX()) + (joystick2.deltaY() * joystick2.deltaY())));
			var f = Math.round(winkel/45);
			var lm = 'Off', rm = 'Off', lp = abstand, rp = abstand;
			if (abstand == 0) {f = -1;}
			switch(f){
				case -1:
					break;
				case 0:
				case 8:
					lm = 'Forward';
					rm = 'Forward';
					break;
				case 1:
					lm = 'Reverse';
					rm = 'Forward';
					lp = Math.floor(lp / 2);
					break;
				case 2:
					lm = 'Reverse';
					rm = 'Forward';
					break;
				case 3:
					lm = 'Reverse';
					rm = 'Forward';
					rp = Math.floor(rp / 2);
					break;
				case 4:
					lm = 'Reverse';
					rm = 'Reverse';
					break;
				case 5:
					lm = 'Forward';
					rm = 'Reverse';
					lp = Math.floor(lp / 2);
					break;
				case 6:
					lm = 'Forward';
					rm = 'Reverse';
					break;
				case 7:
					lm = 'Forward';
					rm = 'Reverse';
					rp = Math.floor(rp / 2);
					break;
			}
			ollie.setRawMotorValues(lm,lp,rm,rp);
		}
	};

	document.getElementById('joystick1').addEventListener('mouseover', function(){
		joystick1.isOver = true;
	})
	document.getElementById('joystick1').addEventListener('mouseout', function(){
		joystick1.isOver = false;
	})
	document.getElementById('joystick1').addEventListener('mousedown', function(){
		joystick1.isDown = true;
	})
	document.getElementById('joystick1').addEventListener('mouseup', function(){
		joystick1.isDown = false;
		ollie.setRawMotorValues('Break',0,'Break',0);
	})
	document.getElementById('joystick2').addEventListener('mouseover', function(){
		joystick2.isOver = true;
	})
	document.getElementById('joystick2').addEventListener('mouseout', function(){
		joystick2.isOver = false;
	})
	document.getElementById('joystick2').addEventListener('mousedown', function(){
		joystick2.isDown = true;
	})
	document.getElementById('joystick2').addEventListener('mouseup', function(){
		joystick2.isDown = false;
		ollie.setRawMotorValues('Brake',255,'Brake',255);
	});

	var ret = function() {
		this.runMe = function(){
			registerCommonKeys(config, $);
			this.interval = setInterval(function(){
				joy1Interval();
				joy2Interval();
			},30);
		};

		this.clearMe = function() {
			clearInterval(this.interval);
		};
	}

	return new ret();
}