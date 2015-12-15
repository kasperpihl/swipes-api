"use strict";

let Promise = require('bluebird');
let r = require('rethinkdb');
// T_TODO Should make our madules local for npm
// so we will not need the relative path
let db = require('../../rest/db.js');

// relative directory to installed apps
let appDir = __dirname + '/../../apps/';
let background = {};

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
	search: (text, callback) => {
		// T_TODO make the search with our SDK
		// for future Tihomir to figure this out
		// - Tihomir from 14.12.2015 send you greetings
		let searchQ = r.table('chat_messages').filter((message) => {
			return message('text').match(text)
		});

		db.rethinkQuery(searchQ)
			.then((messages) => {
				let results = [];

				messages.forEach((message) => {
					let result = {
						id: message.id,
						text: message.text,
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
