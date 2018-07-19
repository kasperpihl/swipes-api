import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const notes = (socket, userId) => {
  const organizationIdQ =
    r.db('swipes')
      .table('users')
      .get(userId)('organizations');

  dbRunQuery(organizationIdQ)
    .then((organizations) => {
      const organization_id = organizations[0];
      if(!organization_id) return;
      const q =
        r.db('swipes')
          .table('notes')
          .getAll(organization_id, { index: 'organization_id' })
          .changes();

      dbRunQuery(q, { feed: true, socket })
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

            socket.send(JSON.stringify({ type, payload: { data: payload } }), (error) => {
              if (error) {
                console.log(error);
                socket.close();
              }
            });
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
