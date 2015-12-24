var registerCommonKeys = require('./registerCommonKeys');
var registerButtons = require('./registerButtons');
var updateStatistics = require('./updateStatistics');
var initMouseJoystick = require('./initMouseJoystick');
var initTankControls = require('./initTankControls');
var initKeyboardControls = require('./initKeyboardControls');
var initMorse = require('./initMorse');

module.exports = function(uuid, $, config) {
	var ollie = new (require('sphero'))(uuid);
	
	ollie.connect(function(){
		$('#greeter > ._1').slideToggle();
		$('#greeter > ._2').html("Connected, Congratz!").slideToggle();
		setTimeout(function() {
			$('#greeter > ._2').slideToggle();
			$('#pages > div').hide();
			$('#'+config.controls).show(); // DEFAULT PAGE // not working
			$('#pages').slideDown();
			$('#greeter').toggleClass('open');

			updateStatistics(config, $);
			registerCommonKeys(config, $);

			var mJoy = initMouseJoystick(ollie, config, $);
			var tank =  initTankControls(ollie, config, $);
			var keyboard =  initKeyboardControls(ollie, config, $);
			var morse =  initMorse(ollie, config, $);

			var starterObjects = {tank: tank, mJoy: mJoy, keyboard: keyboard, morse:morse};

			starterObjects[config.controls].runMe();

			registerButtons(ollie, config, starterObjects, $);
		}, 1000);
	});
}