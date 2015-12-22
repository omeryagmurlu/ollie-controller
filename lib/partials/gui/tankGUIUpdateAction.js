module.exports = function(movement, state) {
	var pedal = $('.throttlespace .pedal');

	pedal.css("height", (movement.speed*2) + "px");

	if (state) {
		switch (state) {
			case 'brake':
				$.alertIt("Emergency Break!", 'trick');
				break;
		}
	}
}