import r from 'rethinkdb';
import {
  string,
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
], (valErr, { note }) => {
  if (valErr) {
    throw new SwipesError(`dbNotesInsert: ${valErr}`);
  }

  const q =
    r.table('notes')
      .insert(note, {
        returnChanges: 'always',
        conflict: (id, oldDoc, newDoc) => {
          return r.branch(
            oldDoc('rev').default(1).eq(newDoc('rev')),
            oldDoc.merge(newDoc.merge({ rev: newDoc('rev').add(1) })),
            oldDoc,
          );
        },
      });
  return db.rethinkQuery(q);
});
const dbNotesGetSingle = funcWrap([
  object.as({
    note_id: string.require(),
    organization_id: string.require(),
  }).require(),
], (valErr, { note_id, organization_id }) => {
  if (valErr) {
    throw new SwipesError(`dbNotesGetSingle: ${valErr}`);
  }

  const q = r.db('swipes').table('notes').getAll([note_id, organization_id], { index: 'id_organization' });

  return db.rethinkQuery(q);
});

export {
  dbNotesInsert,
  dbNotesGetSingle,
};
