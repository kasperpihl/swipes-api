var options = {};
options["applicationId"] = "nf9lMphPOh3jZivxqQaMAg6YLtzlfvRjExUEKST3";
options["javaScriptKey"] = "SEwaoJk0yUzW2DG8GgYwuqbeuBeGg51D1mTUlByg";
options["masterKey"] = "gIvKfS12gMjaJuT2cvdnc1uONs2XpwPSjYQX01vP";

exports.get = function(key){
	return options[key];
}