module.exports = function(config, $) {
var speedRing = $('.speedRing'), 
	speedBar = $('.speedBar span'),
	speed = $('.spacebar span'),
	spPedal = $('#keyboard > .throttle > .pedalSp');

	speedRing.width(config.sp*2);
	speedRing.height(config.sp*2);

	speedBar.width(((config.sp*100)/255)-10 + '%');
	speedBar.parent().find('div').html('Max Speed: '+config.sp+'/255');

	speed.html(config.sp);

	spPedal.css("height", (config.sp*2) + "px");
}