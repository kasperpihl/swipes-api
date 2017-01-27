import r from 'rethinkdb';
import {
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbNotesInsert = funcWrap([
  object.as({
    note: object.require(),
  }).require(),
], (err, { note }) => {
  if (err) {
    throw new SwipesError(`dbNotesInsert: ${err}`);
  }

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
});

export {
  dbNotesInsert,
};
