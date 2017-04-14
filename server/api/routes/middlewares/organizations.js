import r from 'rethinkdb';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbOrganizationsCreate,
  dbOrganizationsGetInfoFromInvitationToken,
  dbOrganizationsGetSingle,
  dbOrganizationsPromoteToAdmin,
  dbOrganizationsDemoteAnAdmin,
} from './db_utils/organizations';
import {
  dbUsersAddOrganization,
} from './db_utils/users';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const organizationsCreate = valLocals('organizationsCreate', {
  user_id: string.require(),
  organization_name: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_name,
  } = res.locals;
  const organizationId = generateSlackLikeId('O');
  const organization = {
    id: organizationId,
    name: organization_name,
    owner_id: user_id,
    admins: [],
    users: [user_id],
    created_at: r.now(),
    updated_at: r.now(),
  };

  dbOrganizationsCreate({ organization })
    .then(() => {
      setLocals({
        organizationId,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsAddToUser = valLocals('organizationsAddToUser', {
  user_id: string.require(),
  organizationId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organizationId,
  } = res.locals;

  dbUsersAddOrganization({ user_id, organizationId })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsGetInfoFromInvitationToken = valLocals('organizationsGetInfoFromInvitationToken', {
  userId: string.require(),
  organizationId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    userId,
    organizationId,
  } = res.locals;
  const fields = ['id', 'profile', 'activated'];

  dbOrganizationsGetInfoFromInvitationToken({ user_id: userId, organization_id: organizationId, fields })
    .then((results) => {
      console.log(results);
      const {
        me,
        organization,
        users,
      } = results;

      setLocals({
        me,
        organization,
        users,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsGetSingle = valLocals('organizationsGetSingle', {
  organization_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
  } = res.locals;

  dbOrganizationsGetSingle({ organization_id })
    .then((organization) => {
      setLocals({
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsCheckAdminRights = valLocals('organizationsCheckAdminRights', {
  user_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization,
  } = res.locals;
  const {
    owner_id,
    admins,
  } = organization;

  if (owner_id !== user_id && !admins.includes(user_id)) {
    return next(new SwipesError('Only owners and admins can promote other users to admins'));
  }

  return next();
});
const organizationsPromoteToAdmin = valLocals('organizationsPromoteToAdmin', {
  organization_id: string.require(),
  user_to_promote_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_promote_id,
  } = res.locals;

  dbOrganizationsPromoteToAdmin({ organization_id, user_id: user_to_promote_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;
      const {
        admins,
        updated_at,
      } = organization;
      const updatedFields = ['admins'];

      setLocals({
        admins,
        updated_at,
        updatedFields,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsDemoteAnAdmin = valLocals('organizationsDemoteAnAdmin', {
  organization_id: string.require(),
  user_to_demote_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_demote_id,
  } = res.locals;

  dbOrganizationsDemoteAnAdmin({ organization_id, user_id: user_to_demote_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;
      const {
        admins,
        updated_at,
      } = organization;
      const updatedFields = ['admins'];

      setLocals({
        admins,
        updated_at,
        updatedFields,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsUpdatedQueueMessage = valLocals('organizationsPromoteToAdminQueueMessage', {
  organization_id: string.require(),
  updatedFields: array.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    updatedFields,
  } = res.locals;
  const queueMessage = {
    organization_id,
    updated_fields: updatedFields,
    event_type: 'organization_updated',
  };

  setLocals({
    queueMessage,
    messageGroupId: organization_id,
  });

  return next();
});

export {
  organizationsCreate,
  organizationsAddToUser,
  organizationsGetInfoFromInvitationToken,
  organizationsGetSingle,
  organizationsCheckAdminRights,
  organizationsPromoteToAdmin,
  organizationsDemoteAnAdmin,
  organizationsUpdatedQueueMessage,
};
