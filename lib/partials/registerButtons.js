module.exports = function(ollie, config, starterFunctions, $) {
		document.getElementById('tankselect').addEventListener('click', function(){
			config.controls = 'tank';
			for (r in starterFunctions) {
				starterFunctions[r].clearMe();
			}
			starterFunctions.tank.runMe();
			$('#controllers > div').hide();
			$('#pages > div').hide();
			$('#controllers').show();
			$('#tank').slideDown();
		});

		document.getElementById('joyselect').addEventListener('click', function(){
			config.controls = 'joystick';
			for (r in starterFunctions) {
				starterFunctions[r].clearMe();
			}
			starterFunctions.mJoy.runMe();
			$('#controllers > div').hide();
			$('#pages > div').hide();
			$('#controllers').show();
			$('#normMove').slideDown();
		});

		document.getElementById('keyselect').addEventListener('click', function(){
			config.controls = 'keyboard';
			for (r in starterFunctions) {
				starterFunctions[r].clearMe();
			}
			starterFunctions.keyboard.runMe();
			$('#controllers > div').hide();
			$('#pages > div').hide();
			$('#controllers').show();
			$('#keyboard').slideDown();
		});

		document.getElementById('morselect').addEventListener('click', function(){
			for (r in starterFunctions) {
				starterFunctions[r].clearMe();
			}
			starterFunctions.morse.runMe();
			$('#pages > div').hide();
			$('#morse').slideDown();
		});

		$('#disconnect').click(function(){
			$(document).off('keydown');
			$('#greeter > ._1').html("Disconnecting, Tschüs!").slideToggle();
			$('.overlay').removeClass('open');
			$('#pages').slideUp();
			$('#greeter').addClass('open');

			ollie.halt(function () {
				setTimeout(function() {
					gui.App.quit();
				},500);
			});
		});

		$('#startCalibration').click(function(){
			ollie.startCalibration();
		});

		$('#finishCalibration').click(function(){
			ollie.finishCalibration();
		});

		$('#setRandomColor').click(function(){
			ollie.setRandomColor();
		});

		$('#setRGB').click(function(){
			ollie.setRGB('0x'+$('#setRGBText').val());
		});
	}