module.exports = function(ollie, config, starterObjects, $) {
		
		var drive = function(){
			for (r in starterObjects) {
				starterObjects[r].clearMe();
			}
			starterObjects[config.controls].runMe();
			$('#controllers > div').hide();
			$('#pages > div').hide();
			$('#controllers').show();
			$('#'+config.controls).slideDown();
		}

		document.getElementById('tankselect').addEventListener('click', function(){
			config.controls = 'tank';
			drive();
		});

		document.getElementById('joyselect').addEventListener('click', function(){
			config.controls = 'mJoy';
			drive();
		});

		document.getElementById('keyselect').addEventListener('click', function(){
			config.controls = 'keyboard';
			drive();
		});

		$('#driveButton').click(drive);

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

			ollie.disconnect(function () {
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
			ollie.randomColor();
		});

		$('#setRGB').click(function(){
			ollie.color('#'+$('#setRGBText').val());
		});
	}