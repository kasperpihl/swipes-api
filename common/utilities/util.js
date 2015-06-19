var crypto    = require('crypto');
var awsRegion =     'us-east-1';
var QueueUrl = 'https://sqs.us-east-1.amazonaws.com/745159268654/Swipes';
var options = {};
var Parse = 		require('parse').Parse;
options["applicationId"] = "nf9lMphPOh3jZivxqQaMAg6YLtzlfvRjExUEKST3";
options["javaScriptKey"] = "SEwaoJk0yUzW2DG8GgYwuqbeuBeGg51D1mTUlByg";
options["masterKey"] = "gIvKfS12gMjaJuT2cvdnc1uONs2XpwPSjYQX01vP";

exports.getOption = function(key){
	return options[key];
}


// ===========================================================================================================
// Get Intercom HMAC based on User ID - used for their secure connection feature
// ===========================================================================================================
exports.getIntercomHmac = function( userId ){
	var key       = 'wHegdJq173o6E3oYkEZ8l2snIKzzY5tgjV_r8CLL';
	var algorithm = 'sha256';
	var hash, hmac;

	hmac = crypto.createHmac(algorithm, key);

	// change to 'binary' if you want a binary digest
	hmac.setEncoding('hex');

	// write in the text that you want the hmac digest for
	hmac.write(userId);

	// you can't read from the stream until you call end()
	hmac.end();

	// read out hmac digest
	hash = hmac.read(); 
	return hash;
}


// ===========================================================================================================
// Generate a random ID, used for etc. new tasks or tags.
// ===========================================================================================================
exports.generateId = function( length ){
	var i, j, possible, ref, text;
	text = "";
	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
exports.sendBackError = function( error, res, logs ){
	var sendError = {code:141,message:'Server error' };
	if ( logs ) 
		sendError.logs = logs;
	if ( error && error.code ) 
		sendError.code = error.code;
	if ( error && error.message ) 
		sendError.message = error.message;
	if ( error && error.hardSync )
		sendError.hardSync = true;
	sendError.ok = false;

	res.send( sendError );
}


// ===========================================================================================================
// Convert a javascript data object into the iso format the clients receive and parse
// ===========================================================================================================
exports.convertDate = function( dateObj ){
	var object = { "__type" : "Date", "iso" : dateObj.toISOString() };
	return object;
};


// ===========================================================================================================
// Sends a message to the Background worker queue
// message should be a json string
// ===========================================================================================================
exports.sendSqsMessage = function(message, callback) {
	'use strict';

	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: awsRegion
	});
	sqs = new AWS.SQS();

	var params = {
		MessageBody: message,
		QueueUrl: QueueUrl,
		DelaySeconds: 0
	};

	sqs.sendMessage(params, function (err, data) {
		if (err) {
			if(callback){
				callback(false, err);
			}
		}
		else {
			if(callback){
				callback(true, false);
			}
		}
	});
}


exports.sendSilentPush = function(channels, userInfo){
	var data = {
		channels:channels, //"wjDRVyp6Ot"
		data:{
			aps:{
				"content-available": 1,
				"sound": ""
			}
		}
	};

	for( var key in userInfo ){
		data.data[key] = userInfo[key];
	}

	Parse.Push.send(data, {
		success:function(){
		},
		error: function(error){
		}
	});
}


// ===========================================================================================================
// Old function to try repair a date string if it's not ISO format - should be deleted at some point (has been fixed in clients)
// ===========================================================================================================
exports.repairDateString = function( dateStr ){
	if(!dateStr) 
		return false;
	var repairedString;
	if(dateStr.indexOf("T") != 10)
		return false;
	var timeStr = dateStr.substring(11);
	var repairedString = timeStr;

	// different variations of am or pm in the string
	var amArray = [' am',' a.m.', ' AM'];
	var pmArray = [' pm', ' p.m.', ' PM'];

	// var to find if am or pm is in the string
	var amOrPm = "none";

	// Convert 
	function convertTo24Hour(hours, amOrPm) {
		if(amOrPm == "am" && hours == 12) {
			hours = 0;
		}
		if(amOrPm == "pm" && hours < 12) {
			hours = (hours + 12);
		}
		var hourString = ""+ hours;
		if( hourString.length == 1)
			hourString = "0" + hourString;

		return hourString;
	};

	function containsStringFromArray(string, array){
		for (var i = 0; i < array.length; i++) {
			var substring = array[i];
			if (string.indexOf(substring) != - 1) {
				return substring;
			}
		}
		return null;
	};

	// locate if AM/PM
	var amString = containsStringFromArray(timeStr, amArray);
	var pmString = containsStringFromArray(timeStr, pmArray);

	// Clean AM/PM out from the string
	if(amString){
		repairedString = repairedString.replace(amString, "");
		amOrPm = "am";
	}
	else if(pmString){
		repairedString = repairedString.replace(pmString, "");
		amOrPm = "pm";
	}

	var minuteSeperatorIndex = repairedString.indexOf(':');
	if(minuteSeperatorIndex == -1){
		repairedString = repairedString.replace('.',':');
	}

	// if , occurs, replace it with a dot
	repairedString = repairedString.replace(',','.');

	// Replace hours accordingly
	if(amOrPm != "none"){

		var hour = parseInt(timeStr.substring(0, minuteSeperatorIndex ));

		var newHourString = convertTo24Hour(hour, amOrPm);
		repairedString = newHourString + repairedString.substring(minuteSeperatorIndex);

	}

	var newString = dateStr.substring(0,11) + repairedString;
	//console.log(dateStr.substring(0,11) + repairedString);
	//console.log( "repaired " + timeStr + " to: " +newString );
	// Replace signs
	return newString;
}