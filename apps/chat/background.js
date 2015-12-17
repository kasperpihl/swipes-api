"use strict";

let Promise = require('bluebird');
let r = require('rethinkdb');
// T_TODO Should make our madules local for npm
// so we will not need the relative path
let db = require('../../rest/db.js');

// relative directory to installed apps
let appDir = __dirname + '/../../apps/';
let background = {};

// Private methods
let getContext = (word, message) => {
	let maxChars = 35;

	if (message.length <= maxChars) {
			return message;
  } else if (word.length > maxChars) {
		return word;
  } else {
		let index = message.indexOf(word);
		let endIndex = index + word.length;
		let beforeString;

		if (index > 0) {
			beforeString = message.substring(0, index);
		} else {
			beforeString = ''
		}

		let afterString = message.substring(endIndex, message.length -1);
		let availableChars = maxChars - word.length;
		let availableCharsForSide = parseInt(availableChars / 2);
		let availableCharsBefore = availableCharsForSide;
		let availableCharsAfter = availableCharsForSide;
		let beforeLen = beforeString.length;
		let afterLen = afterString.length;

		if (availableCharsForSide > beforeLen) {
			availableCharsBefore = beforeLen;
			availableCharsAfter = availableCharsForSide + (availableCharsForSide - beforeLen)
		} else if (availableCharsForSide > afterLen) {
			availableCharsAfter = afterLen;
			availableCharsBefore = availableCharsForSide + (availableCharsForSide - afterLen)
		}

		if (availableCharsBefore !== beforeLen) {
			beforeString = '...' + message.substring(index-availableCharsBefore, index);
		}

		if (availableCharsAfter !== afterLen) {
			afterString = message.substring(endIndex, endIndex + availableCharsAfter);
		}

		return beforeString + word + afterString;
	}
}

background.beforeHandlers = {
	messages: (data, callback) => {
		if (!data.ts) {
			let threeRandom = ('000' + Math.random().toFixed(3)*1000).substr(-3);
			let ts = parseFloat(new Date().getTime() / 1000).toFixed(3) + threeRandom;

			data.ts = ts;
		}

		console.log("before", data);

		callback(null, data);
	}
};

background.eventHandlers = {
	newMessages: (data) => {
		swipes.currentApp().up
	}
};

background.afterHandlers = {
	messages: (data, old, callback) => {
		console.log("after handler, do something after object is saved here");

		callback();
	}
};

background.methods = {
	start: (data, callback) => {
		console.log("method run", data);

		callback(null, "yeah");
	},
	search: (query, callback) => {
		// T_TODO make the search with our SDK
		// for future Tihomir to figure this out
		// - Tihomir from 14.12.2015 send you greetings
		let searchQ = r.table('chat_messages').filter((message) => {
			return message('text').match('(?i)' + query)
		});

		db.rethinkQuery(searchQ)
			.then((messages) => {
				let results = [];

				messages.forEach((message) => {
					let result = {
						id: message.id,
						text: getContext(query, message.text),
						user_id: message.user_id,
						scope: message.scope,
						ts: message.ts,
						icon: 'message' // T_TODO what icons we will have?!
					}

					results.push(result);
				})

				callback(null, results);
			})
			.catch((err) => {
				console.log(err);
			})
	}
}

module.exports = background;
