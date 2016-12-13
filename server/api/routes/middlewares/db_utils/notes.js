import r from 'rethinkdb';
import db from '../../../../db';

const dbNotesInsert = ({ note }) => {
  const q =
    r.table('notes')
      .insert(note, {
        conflict: (id, oldDoc, newDoc) => {
          return r.branch(
            oldDoc('locked_by').ne(null).and(oldDoc('locked_by').ne(newDoc('user_id'))),
            r.branch(
              oldDoc('ts').add(30).gt(newDoc('ts')),
              oldDoc,
              oldDoc.merge(newDoc),
            ),
            oldDoc.merge(newDoc),
          );
        },
      });

  return db.rethinkQuery(q);
};

export {
  dbNotesInsert,
};
