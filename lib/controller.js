var preInit = require('./partials/preInit');
var gui = global.gui = require('nw.gui');

// require madness
global.document = window.document;
global.cancelAnimationFrame = window.cancelAnimationFrame;
global.requestAnimationFrame = window.requestAnimationFrame;
global.localStorage = window.localStorage;
global.$ = window.$;
global.VirtualJoystick = window.VirtualJoystick;

//some self written, little Jquery Plugins

$.alertIt = function(text, type) {
	$('.alert').remove();

	var alert = $('<div></div>');
	alert.addClass('alert');
	alert.prependTo('body');

	if (type) {
		switch(type) {
			case "trick":
				alert.css('color', 'red');
				break;
		}
	} else {
		alert.css('color', 'blue');
	}
	alert.html(text);

	alert.addClass('on');
	setTimeout(function () {
		alert.removeClass('on');
		setTimeout(function () {
			alert.remove();
		},500)
	},1000)

	return $;
}

preInit(false);
