var options = {};
options["applicationId"] = "nf9lMphPOh3jZivxqQaMAg6YLtzlfvRjExUEKST3";
options["javaScriptKey"] = "SEwaoJk0yUzW2DG8GgYwuqbeuBeGg51D1mTUlByg";
options["masterKey"] = "gIvKfS12gMjaJuT2cvdnc1uONs2XpwPSjYQX01vP";
options["restKey"] = "amD6pp6QsoKCIp5akSTmIGulb2Vw7YtBCVOZwC0s";
options["parseUrl"] = "https://pg-app-7zd37b94rjuze3x1cwrxfhlf9qj292.scalabl.cloud/1/";

exports.get = function(key){
  return options[key];
}
