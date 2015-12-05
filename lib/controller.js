var preInit = require('./partials/preInit');
var gui = global.gui = require('nw.gui');

// require madness
global.document = window.document;
global.cancelAnimationFrame = window.cancelAnimationFrame;
global.requestAnimationFrame = window.requestAnimationFrame;
global.localStorage = window.localStorage;
global.$ = window.$;
global.VirtualJoystick = window.VirtualJoystick;

preInit(false);