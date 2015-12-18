var registerCommonKeys = require('./registerCommonKeys');
var registerButtons = require('./registerButtons');
var updateStatistics = require('./updateStatistics');
var initMouseJoystick = require('./initMouseJoystick');
var initTankControls = require('./initTankControls');
var initKeyboardControls = require('./initKeyboardControls');
var initMorse = require('./initMorse');

module.exports = function(uuid, $) {
	var ollie = new (require('olliejs'))(uuid);

	var config = {
		controls: 'joystick',
		sp: 80, 
		mode: 1
	}

	ollie.on("connect", function(){
		$('#greeter > ._1').slideToggle();
		$('#greeter > ._2').html("Connected, Congratz!").slideToggle();
		setTimeout(function() {
			$('#greeter > ._2').slideToggle();
			$('#pages').slideDown();
			$('#greeter').toggleClass('open');

			updateStatistics(config, $);
			registerCommonKeys(config, $);

			var mouseJoystickObj = initMouseJoystick(ollie, config, $);
			var tankObj =  initTankControls(ollie, config, $);
			var keyboardObj =  initKeyboardControls(ollie, config, $);
			var morse =  initMorse(ollie, config, $);

			mouseJoystickObj.runMe(); //Start default joystick at the beginng  // will change soon to remember last selection

			registerButtons(ollie, config, {tank: tankObj, mJoy: mouseJoystickObj, keyboard: keyboardObj, morse:morse}, $);
		}, 1000);
	});
	ollie.init();
}