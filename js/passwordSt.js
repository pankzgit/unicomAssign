(function (document) {

var passwordString = null;

var input = document.getElementById("password");

input.addEventListener("keyup", analyzeString, false);

function analyzeString (ev) {
	var target = ev.target;
	passwordString = target.value;

	var length = passwordString.length;
	var upperCaseCount = 0;
	var numberCount = 0;
	var symbolCount = 0;

	for (var i = 0; i< length; i++) {
		if (!isNaN(parseInt(passwordString[i]))) {
			numberCount++;
		}
		else if (/[A-Za-z]/.test(passwordString[i]) && passwordString[i] === passwordString[i].toUpperCase()) {
			upperCaseCount++;
		}

		else if (!/[A-Za-z]/.test(passwordString[i])) {
			symbolCount++;
		}
	}

	calcComplexity({
		length: length,
		upperCaseCount: upperCaseCount,
		symbolCount: symbolCount,
		numberCount: numberCount
	});
}

function calcComplexity (obj) {
	var score = 50;
	var msg = document.getElementsByClassName("passwordErrMsg")[0];
	if (obj.length === 0) {
		msg.innerHTML = "";
		return;
	}
	if (obj.length > 6) {
		score = score + 12;
		if (obj.upperCaseCount >= 1) {
			score = score + 8;
		}
		if (obj.symbolCount >= 1) {
			score = score + 15;
		}

		if (obj.numberCount >= 1) {
			score = score + 15;
		}

		if (obj.numberCount && obj.symbolCount && obj.upperCaseCount) {
			score = score + 25;
		}
	}


	console.log(score);

	if (score < 62) {
		msg.className = "passwordErrMsg wk"
		msg.innerHTML = "Weak";
	}
	if (score >= 62 && score <= 77) {
		msg.className = "passwordErrMsg avg"
		msg.innerHTML = "Average";
	}
	if (score > 77 && score < 100) {
		msg.className = "passwordErrMsg str"
		msg.innerHTML = "Strong";
	}
	if (score >= 100) {
		msg.className = "passwordErrMsg sec"
		msg.innerHTML = "Secure";
	}
}

}) (document);