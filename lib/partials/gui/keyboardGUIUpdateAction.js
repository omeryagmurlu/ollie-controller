module.exports = function(speed, heading) {
	var keyCont = $('#keyboard > .joystickContext > .innerKeyCont');
	var arrDo = $('#keyboard > .joystickContext .line .arrDo');
	var line = $('#keyboard > .joystickContext .line');
	var pedal = $('#keyboard > .throttle > .pedal');

	keyCont.css("transform", "rotate("+ heading +"deg)");

	line.css("transform", "rotate("+ heading +"deg)");
	line.css("top",(205 - speed) + "px");

	arrDo.css("height", speed + "px");

	pedal.css("height", (speed*2) + "px");
}