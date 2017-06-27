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

  const q =
    r.expr({}).merge({
      me: r.table('users').get(user_id).pluck('invited_by', 'email', 'profile', 'activated'),
      organization: r.table('organizations').get(organization_id).pluck('name'),
    })
    .do((result) => {
      return result.merge({
        invited_by: r.table('users').get(result('me')('invited_by')).pluck('id', 'profile'),
      });
    });

  return db.rethinkQuery(q);
});
const dbOrganizationsGetSingle = funcWrap([
  object.as({
    organization_id: string.require(),
  }).require(),
], (err, { organization_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsGetSingle: ${err}`);
  }

  const q = r.table('organizations').get(organization_id);

  return db.rethinkQuery(q);
});
const dbOrganizationsPromoteToAdmin = funcWrap([
  object.as({
    organization_id: string.require(),
    user_id: string.require(),
  }).require(),
], (err, { organization_id, user_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsPromoteToAdmin: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        admins: r.row('admins').default([]).setUnion([user_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsDemoteAnAdmin = funcWrap([
  object.as({
    organization_id: string.require(),
    user_id: string.require(),
  }).require(),
], (err, { organization_id, user_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsDemoteAnAdmin: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        admins: r.row('admins').default([]).difference([user_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsTransferOwnership = funcWrap([
  object.as({
    organization_id: string.require(),
    user_id: string.require(),
    user_to_transfer_id: string.require(),
  }).require(),
], (err, { organization_id, user_id, user_to_transfer_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsTransferOwnership: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        owner_id: user_to_transfer_id,
        admins: r.row('admins').default([]).setUnion([user_id]).difference([user_to_transfer_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsDisableUser = funcWrap([
  object.as({
    organization_id: string.require(),
    user_id: string.require(),
  }).require(),
], (err, { organization_id, user_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsDisableUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        disabled_users: r.row('disabled_users').default([]).setUnion([user_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsEnableUser = funcWrap([
  object.as({
    organization_id: string.require(),
    user_id: string.require(),
  }).require(),
], (err, { organization_id, user_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsEnableUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        disabled_users: r.row('disabled_users').default([]).difference([user_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsUpdateStripeCustomerIdAndPlan = funcWrap([
  object.as({
    organization_id: string.require(),
    stripe_customer_id: string.require(),
    plan: string.require(),
  }).require(),
], (err, { organization_id, stripe_customer_id, plan }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsUpdateStripeCustomerId: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        stripe_customer_id,
        plan,
        updated_at: r.now(),
      });

  return db.rethinkQuery(q);
});

export {
  dbOrganizationsCreate,
  dbOrganizationsAddUser,
  dbOrganizationsGetInfoFromInvitationToken,
  dbOrganizationsGetSingle,
  dbOrganizationsPromoteToAdmin,
  dbOrganizationsDemoteAnAdmin,
  dbOrganizationsTransferOwnership,
  dbOrganizationsDisableUser,
  dbOrganizationsEnableUser,
  dbOrganizationsUpdateStripeCustomerIdAndPlan,
};
