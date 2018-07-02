import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbNotesInsertWithConflictHandling = funcWrap([
  object.as({
    note: object.require(),
  }).require(),
], (valErr, { note }) => {
  if (valErr) {
    throw new SwipesError(`dbNotesInsertWithConflictHandling: ${valErr}`);
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

  return dbRunQuery(q);
});
const dbNotesInsertBatch = funcWrap([
  object.as({
    notes: array.require(),
  }).require(),
], (valErr, { notes }) => {
  if (valErr) {
    throw new SwipesError(`dbNotesInsertBatch: ${valErr}`);
  }

  const q = r.table('notes').insert(notes);

  return dbRunQuery(q);
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

  return dbRunQuery(q);
});
const dbNotesGetMultiple = funcWrap([
  object.as({
    note_ids: array.require(),
    organization_id: string.require(),
  }).require(),
], (valErr, { note_ids, organization_id }) => {
  if (valErr) {
    throw new SwipesError(`dbNotesGetMultiple: ${valErr}`);
  }

  const compoundIndexArgs = [];

  note_ids.forEach((note_id) => {
    compoundIndexArgs.push([
      note_id,
      organization_id,
    ]);
  });

  const q = r.db('swipes').table('notes').getAll(...compoundIndexArgs, { index: 'id_organization' });

  return dbRunQuery(q);
});

export {
  dbNotesInsertWithConflictHandling,
  dbNotesGetSingle,
  dbNotesGetMultiple,
  dbNotesInsertBatch,
};
