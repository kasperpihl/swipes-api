"use strict";

let Promise = require('bluebird');
let r = require('rethinkdb');
// T_TODO Should make our modules local for npm
// so we will not need the relative path
let util = require('../../rest/util.js');
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
		if (!query || typeof query !== 'string') {
			callback(new Error("Query should be a string!"));
		}

		let escapedQuery = util.escapeRegExp(query);

		// T_TODO make the search with our SDK
		// for future Tihomir to figure this out
		// - Tihomir from 14.12.2015 send you greetings
		let searchQ =
			r.table('chat_messages')
				.filter((message) => {
					return message('text').match('(?i)' + escapedQuery)
				})
				.orderBy(r.desc('ts'));

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
				callback(new Error("Ooops!"));
			})
	},
	preview: (data, callback) => {
		if (!data.id || !data.scope) {
			callback(new Error("You should provide id and scope!"));
		}

		let messageContextParamsQ =
			r.table('chat_messages')
				.filter({scope: data.scope})
				.orderBy('ts')
				.concatMap((message) => {return [message('id')]})
				.do((map) => {
					return {
						count: map.count(),
						offset: map.offsetsOf(data.id).nth(0)
					}
				})

		db.rethinkQuery(messageContextParamsQ)
			.then((contextParams) => {
				let count = contextParams.count;
				let offset = contextParams.offset;
				let startOffset = offset - 2;
				let endOffset = offset + 2;

				if (startOffset < 0) {
					endOffset = endOffset + Math.abs(startOffset);
					startOffset = 0;
				} else if (endOffset > count) {
					// I need that magic -1 there for now.
					// I think I found a bug with the rethinkdb implementation of slice
					startOffset = startOffset - (endOffset - count) - 1;
					endOffset = count;

					if (startOffset < 0) {
						startOffset = 0;
					}
				}

				let contextQ =
					r.table('chat_messages')
						.filter({scope: data.scope})
						.orderBy('ts')
						.slice(startOffset, endOffset, {rightBound:'closed'})

				return db.rethinkQuery(contextQ)
			})
			.then((context) => {
				context.map((element) => {
					if (element.id === data.id) {
						element.highlight = true;
					}

					return element;
				})

				callback(null, context);
			})
			.catch((err) => {
				console.log(err);
				callback(new Error("Ooops!"));
			})
	}
}

module.exports = background;
