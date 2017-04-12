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

const dbOrganizationsCreate = funcWrap([
  object.as({
    organization: object.require(),
  }).require(),
], (err, { organization }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsCreate: ${err}`);
  }

  const q = r.table('organizations').insert(organization);

  return db.rethinkQuery(q);
});
const dbOrganizationsAddUser = funcWrap([
  object.as({
    user_id: string.require(),
    organization_id: string.require(),
  }).require(),
], (err, { user_id, organization_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsAddUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        users: r.row('users').append(user_id),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbOrganizationsCreate,
  dbOrganizationsAddUser,
};
