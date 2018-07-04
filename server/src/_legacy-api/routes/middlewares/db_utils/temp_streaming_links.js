import r from 'rethinkdb';
import {
  string,
  object,
  funcWrap,
} from 'valjs';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import SwipesError from 'src/utils/SwipesError';

const dbCreateTempStreamingLink = funcWrap([
  object.as({
    insert_doc: object.require(),
  }).require(),
], (err, { insert_doc }) => {
  if (err) {
    throw new SwipesError(`createTempStreamingLink: ${err}`);
  }

  insert_doc.ts = r.now();

  const q = r.table('temp_streaming_links').insert(insert_doc, { returnChanges: 'always' });

  return dbRunQuery(q);
});

const dbGetSingleTempStreamingLink = funcWrap([
  object.as({
    id: string.require(),
  }).require(),
], (err, { id }) => {
  if (err) {
    throw new SwipesError(`getSingleTempStreamingLink: ${err}`);
  }

  const q = r.table('temp_streaming_links').get(id);

  return dbRunQuery(q);
});

export {
  dbCreateTempStreamingLink,
  dbGetSingleTempStreamingLink,
};
