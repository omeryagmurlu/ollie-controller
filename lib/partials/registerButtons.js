module.exports = function(ollie, config, starterObjects, $) {
		document.getElementById('tankselect').addEventListener('click', function(){
			config.controls = 'tank';
		});

		document.getElementById('joyselect').addEventListener('click', function(){
			config.controls = 'mJoy';
		});

		document.getElementById('keyselect').addEventListener('click', function(){
			config.controls = 'keyboard';
		});

		$('#driveButton').click(function(){
			for (r in starterObjects) {
				starterObjects[r].clearMe();
			}
			starterObjects[config.controls].runMe();
			$('#controllers > div').hide();
			$('#pages > div').hide();
			$('#controllers').show();
			$('#'+config.controls).slideDown();
		});

		$('#optionButton').click(function(){  // ayarları aç, menüyü kapa
			$('#menu').removeClass('open');
			$('#options').addClass('open');
		});

		$('#morselect').click(function(){
			for (r in starterObjects) {
				starterObjects[r].clearMe();
			}
			starterObjects.morse.runMe();
			$('#pages > div').hide();
			$('#morse').slideDown();
		});

		$('#disconnect').click(function(){
			$(document).off('keydown');
			localStorage.config = JSON.stringify(config);

			$('#greeter > ._1').html("Disconnecting, Tschüs!").slideToggle();
			$('.overlay').removeClass('open');
			$('#pages').hide();
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