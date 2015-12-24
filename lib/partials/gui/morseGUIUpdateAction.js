exports.typeMorse = function(m) {
	var words = $("#wordsMorse");

	var morseCodes = $("#morseCodes");

	if (m === "EoS") {
		$("#morse1").removeClass("closed");
		$("#morse2").slideUp();
		morseCodes.html("");
		words.html("");
		return 0;
	}

	if (m === "|") {
		morseCodes.html("");
		var array = $("#morseTextArea").val().split(" ");
		var index = array.indexOf(words.html());
		if (index === array.length) {
			words.html("");
		} else {
			words.html(array[index+1]);
		}

		var chars = words.html().split("");
		$("#hiddenChar").html('0');

		return 0;
	}

	if (m === " ") {
		var chars = words.html().split("");
		var index = parseInt($("#hiddenChar").html());
		if (index !== chars.length-1) {
			$("#hiddenChar").html((index+1).toString())
		}
		// we dont return because it needs to print the space in morse
	}

	morseCodes.html(morseCodes.html() + m);
}

exports.main = function (sendMorseFunction, abortFunction) {
	var words = $("#wordsMorse");

	//sendMorseFunction("ömer çok zeki");

	$("#morseSend").click(function() {
		abortFunction(); // Abort ongoing comms on new

		$("#morse1").addClass("closed");
		$("#morse2").slideDown();

		var array = $("#morseTextArea").val().split(" ");
		words.html(array[0]);
		var chars = words.html().split("");
		$("#hiddenChar").html('0');

		sendMorseFunction($("#morseTextArea").val())
	})

	return function(){
		$("#morseSend").off("click");
	}
}