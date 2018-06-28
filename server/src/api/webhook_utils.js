import r from 'rethinkdb';
import db from '../db';

const updateCursors = ({ user_id, accountId, cursors }) => {
  const query = r.table('users').get(user_id)
    .update({
      services: r.row('services')
        .map((service) => {
          return r.branch(
            service('id').eq(accountId),
            service.merge({ cursors: service('cursors').default({}).merge(cursors) }),
            service,
          );
        },
        ),
    });

  db.rethinkQuery(query)
    .then(() => {
      console.log('Cursor updated!');
    })
    .catch((err) => {
      console.log('Error updating cursor', err);
    });
};

const insertEvent = ({ user_id, eventData }) => {
  const date = new Date();
  const type = 'activity_added';

  Object.assign(eventData, {
    user_id,
    date,
    type,
  });

  const query = r.table('events').insert(eventData);

  db.rethinkQuery(query)
    .then(() => {
      console.log('event inserted', eventData);
    })
    .catch((err) => {
      console.log(err);
    });
};

export {
  updateCursors,
  insertEvent,
};
