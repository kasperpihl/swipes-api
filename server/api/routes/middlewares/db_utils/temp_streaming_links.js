import r from 'rethinkdb';
import {
  object,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const createTempStreamingLink = funcWrap([
  object.as({
    insert_doc: object.require(),
  }).require(),
], (err, { insert_doc }) => {
  if (err) {
    throw new SwipesError(`createTempStreamingLink: ${err}`);
  }

  insert_doc.ts = r.now();

  const q = r.table('temp_streaming_links').insert(insert_doc, { returnChanges: 'always' });

  return db.rethinkQuery(q);
});

export {
  createTempStreamingLink,
};
