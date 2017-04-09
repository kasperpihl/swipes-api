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

const dbFilesGetSingle = funcWrap([
  object.as({
    id: string.require(),
  }).require(),
], (err, { id }) => {
  if (err) {
    throw new SwipesError(`dbFilesGetSingle: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('files')
      .get(id);

  return db.rethinkQuery(q);
});
const dbFilesAdd = funcWrap([
  object.as({
    user_id: string.require(),
    organization_id: string.require(),
    file_name: string.require(),
    s3_path: string.require(),
    fileId: string.require(),
    contentType: string.require(),
  }).require(),
], (err, { user_id, organization_id, file_name, s3_path, fileId, contentType }) => {
  if (err) {
    throw new SwipesError(`dbFilesAdd: ${err}`);
  }

  const q =
    r.db('swipes')
      .table('files')
      .insert({
        organization_id,
        file_name,
        s3_path,
        id: fileId,
        content_type: contentType,
        created_at: r.now(),
        created_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbFilesAdd,
  dbFilesGetSingle,
};
