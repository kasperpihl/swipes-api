"use strict";

import r from 'rethinkdb';
import db from '../db.js'; // T_TODO I should make this one a local npm module

const updateCursors = ({ userId, accountId, cursors }) => {
  const query = r.table('users').get(userId)
  	.update({services: r.row('services')
  		.map((service) => {
  			return r.branch(
  				service('id').eq(accountId),
          service.merge({cursors: service('cursors').default({}).merge(cursors)}),
  				service
  			)
  		})
  	});

  db.rethinkQuery(query)
  	.then(() => {
  		console.log('Cursor updated!')
  	})
  	.catch((err) => {
  		console.log('Error updating cursor', err);
  	});
}

const insertEvent = ({ userId, eventData }) => {
  const date = new Date();
  const type = 'activity';

  Object.assign(eventData, {
    user_id: userId,
    date,
    type
  });

  const query = r.table('events').insert(eventData);

  db.rethinkQuery(query)
    .then(() => {
      console.log('event inserted', eventData);
    })
    .catch((err) => {
      console.log(err);
    });
}

export {
  updateCursors,
  insertEvent
}
