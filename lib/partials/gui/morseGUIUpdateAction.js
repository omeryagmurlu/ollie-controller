module.exports = function(c, m) {
	var inDiv = $('#morse > .in');
	var outDiv = $('#morse > .out');

	var str = inDiv.html() + c;
	var strM = outDiv.html() + " " + m;

	if (str.length > 15) {
		str = str.slice(-15);
	}

	var mArr = strM.split(" ");
	if (mArr.length > 15) {
		mArr = mArr.splice(-15,15);
		strM = mArr.join(" ");
	}

	inDiv.html(str);
	outDiv.html(strM);
}