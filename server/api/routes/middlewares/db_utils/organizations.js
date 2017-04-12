import r from 'rethinkdb';
import {
  string,
  object,
  array,
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
const dbOrganizationsGetInfoFromInvitationToken = funcWrap([
  object.as({
    user_id: string.require(),
    organization_id: string.require(),
    fields: array.require(),
  }).require(),
], (err, { user_id, organization_id, fields }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsGetInfoFromInvitationToken: ${err}`);
  }

  console.log(user_id);
  const q =
    r.expr({}).merge({
      me: r.table('users').get(user_id).pluck('invited_by', 'email', 'profile'),
      organization: r.table('organizations').get(organization_id).pluck('name'),
      users: r.table('organizations')
        .get(organization_id)('users')
        .map((user) => {
          return r.table('users').get(user).pluck(...fields);
        })
        .filter((user) => {
          return user('activated').eq(true);
        }),
    });

  return db.rethinkQuery(q);
});

export {
  dbOrganizationsCreate,
  dbOrganizationsAddUser,
  dbOrganizationsGetInfoFromInvitationToken,
};