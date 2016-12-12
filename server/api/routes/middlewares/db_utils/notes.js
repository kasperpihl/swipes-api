import r from 'rethinkdb';
import db from '../../../../db';

const dbNotesInsert = ({ note }) => {
  const q =
    r.table('notes')
      .insert(note, {
        returnChanges: 'always',
        conflict: (id, oldDoc, newDoc) => {
          return oldDoc.merge(newDoc);
        },
      });

  return db.rethinkQuery(q);
};

export {
  dbNotesInsert,
};
