var init = require('./init');
var neave = require('./neave');

module.exports = function(slowCPU) {
	$('#greeter > div').hide();
	$('#controllers > div').hide();
	$('#controllers > #normMove').show();
	$('#pages').hide(); //Hide da baclkfgorm

	if (localStorage.oldUUID) {
		$('#greeter > input').val(localStorage.oldUUID)
	}
	if (!slowCPU) {
		neave();
	}

	$(document).keydown(function(event) {
		switch(event.keyCode) {
			case 13:
				//enter
				event.preventDefault()
				var uuid = $('#greeter > input').val();
				localStorage.oldUUID = uuid;
				//ollie.on connect olduqunda overlay kalkcak
				$('#greeter > input').slideUp();
				$('#greeter > ._1').html("Connecting to your Ollie, hang tight!").slideToggle();
				$(document).off('keydown');
				init(uuid, $);
				break;
		}
	}); // self deleting enter
}