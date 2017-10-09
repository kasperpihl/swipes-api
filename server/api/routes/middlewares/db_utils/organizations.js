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

  const q = r.table('organizations').insert(organization, {
    returnChanges: 'always',
  });

  return db.rethinkQuery(q);
});
const dbOrganizationsAddPendingUser = funcWrap([
  object.as({
    organization_id: string.require(),
    user_id: string.require(),
  }).require(),
], (err, { user_id, organization_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsAddPendingUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        pending_users: r.row('pending_users').default([]).setUnion([user_id]),
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
    user_to_disable_id: string.require(),
  }).require(),
], (err, { organization_id, user_to_disable_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsDisableUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        active_users: r.row('active_users').default([]).difference([user_to_disable_id]),
        pending_users: r.row('pending_users').default([]).difference([user_to_disable_id]),
        disabled_users: r.row('disabled_users').default([]).setUnion([user_to_disable_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      }).do((result) => {
        return r.table('users').get(user_to_disable_id).update((user) => {
          return {
            organizations: user('organizations').default([]).difference([organization_id]),
            pending_organizations: user('pending_organizations').default([]).difference([organization_id]),
            updated_at: r.now(),
          };
        }).do(() => {
          return result;
        });
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsDisableAllUsers = funcWrap([
  object.as({
    organization_id: string.require(),
  }).require(),
], (err, { organization_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsDisableAllUsers: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        active_users: [],
        pending_users: [],
        disabled_users: r.row('disabled_users').default([]).setUnion(r.row('active_users')),
        updated_at: r.now(),
      }, {
        returnChanges: 'always',
      }).do((result) => {
        return r.table('users').getAll(r.args(result('changes').nth(0)('old_val')('active_users').default([]).setUnion(result('changes').nth(0)('new_val')('pending_users').default([])))).update((user) => {
          return {
            organizations: user('organizations').default([]).difference([organization_id]),
            pending_organizations: user('pending_organizations').default([]).difference([organization_id]),
            updated_at: r.now(),
          };
        });
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsActivateUser = funcWrap([
  object.as({
    organization_id: string.require(),
    user_to_activate_id: string.require(),
  }).require(),
], (err, { organization_id, user_to_activate_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsActivateUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        active_users: r.row('active_users').default([]).setUnion([user_to_activate_id]),
        pending_users: r.row('pending_users').default([]).difference([user_to_activate_id]),
        disabled_users: r.row('disabled_users').default([]).difference([user_to_activate_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsEnableUser = funcWrap([
  object.as({
    organization_id: string.require(),
    user_to_enable_id: string.require(),
  }).require(),
], (err, { organization_id, user_to_enable_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsEnableUser: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        pending_users: r.row('pending_users').default([]).setUnion([user_to_enable_id]),
        disabled_users: r.row('disabled_users').default([]).difference([user_to_enable_id]),
        active_users: r.row('active_users').default([]).difference([user_to_enable_id]),
        updated_at: r.now(),
      }, {
        returnChanges: true,
      }).do((result) => {
        return r.table('users').get(user_to_enable_id).update((user) => {
          return {
            organizations: user('organizations').default([]).difference([organization_id]),
            pending_organizations: user('pending_organizations').default([]).setUnion([organization_id]),
          };
        }).do(() => {
          return result;
        });
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
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbOrganizationsUpdateStripeSubscriptionId = funcWrap([
  object.as({
    organization_id: string.require(),
    stripe_subscription_id: string,
  }).require(),
], (err, { organization_id, stripe_subscription_id }) => {
  if (err) {
    throw new SwipesError(`dbOrganizationsUpdateStripeSubscriptionId: ${err}`);
  }

  const q =
    r.table('organizations')
      .get(organization_id)
      .update({
        stripe_subscription_id,
        updated_at: r.now(),
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});

export {
  dbOrganizationsCreate,
  dbOrganizationsAddPendingUser,
  dbOrganizationsGetInfoFromInvitationToken,
  dbOrganizationsGetSingle,
  dbOrganizationsPromoteToAdmin,
  dbOrganizationsDemoteAnAdmin,
  dbOrganizationsTransferOwnership,
  dbOrganizationsDisableUser,
  dbOrganizationsEnableUser,
  dbOrganizationsUpdateStripeCustomerIdAndPlan,
  dbOrganizationsUpdateStripeSubscriptionId,
  dbOrganizationsActivateUser,
  dbOrganizationsDisableAllUsers,
};
