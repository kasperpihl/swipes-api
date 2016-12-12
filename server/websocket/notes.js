import r from 'rethinkdb';
import db from '../db';

const notes = (socket, userId) => {
  const organizationIdQ =
    r.db('swipes')
      .table('users')
      .get(userId)('organizations')
      .nth(0);

  db.rethinkQuery(organizationIdQ)
    .then((organization_id) => {
      const q =
        r.db('swipes')
          .table('notes')
          .getAll(organization_id, { index: 'organization_id' })
          .changes();

      db.rethinkQuery(q, { feed: true, socket })
        .then((cursor) => {
          cursor.each((err, row) => {
            if (err) {
              console.log(err);
              // T_TODO how to handle erros here?!
              // Sending error message on the socket?
              return;
            }

            const type = 'note_updated';
            const payload = row.new_val;

            socket.send(JSON.stringify({ type, payload }));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

export default notes;
