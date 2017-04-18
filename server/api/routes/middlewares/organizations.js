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
  dbOrganizationsTransferOwnership,
  dbOrganizationsDisableUser,
  dbOrganizationsEnableUser,
} from './db_utils/organizations';
import {
  dbUsersAddOrganization,
} from './db_utils/users';
import {
  valLocals,
  generateSlackLikeId,
  getDownloadLinks,
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
      const {
        me,
        organization,
        invited_by,
      } = results;

      setLocals({
        me,
        organization,
        invited_by,
        download_links: getDownloadLinks(),
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
    return next(new SwipesError('Only owners and admins can do this action'));
  }

  return next();
});
const organizationsCheckOwnerRights = valLocals('organizationsCheckOwnerRights', {
  user_id: string.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization,
  } = res.locals;
  const {
    owner_id,
  } = organization;

  if (owner_id !== user_id) {
    return next(new SwipesError('Only owners can do this action'));
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
const organizationsTransferOwnership = valLocals('organizationsTransferOwnership', {
  user_id: string.require(),
  organization_id: string.require(),
  user_to_transfer_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    user_to_transfer_id,
  } = res.locals;

  dbOrganizationsTransferOwnership({ organization_id, user_id, user_to_transfer_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;
      const {
        owner_id,
        admins,
        updated_at,
      } = organization;
      const updatedFields = ['owner_id', 'admins'];

      setLocals({
        owner_id,
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
const organizationsDisableUser = valLocals('organizationsDisableUser', {
  organization_id: string.require(),
  user_to_disable_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_disable_id,
  } = res.locals;

  dbOrganizationsDisableUser({ organization_id, user_id: user_to_disable_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;
      const {
        disabled_users,
        updated_at,
      } = organization;
      const updatedFields = ['disabled_users'];

      setLocals({
        disabled_users,
        updated_at,
        updatedFields,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const organizationsEnableUser = valLocals('organizationsEnableUser', {
  organization_id: string.require(),
  user_to_enable_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user_to_enable_id,
  } = res.locals;

  dbOrganizationsEnableUser({ organization_id, user_id: user_to_enable_id })
    .then((result) => {
      const changes = result.changes[0];
      const organization = changes.new_val || changes.old_val;
      const {
        disabled_users,
        updated_at,
      } = organization;
      const updatedFields = ['disabled_users'];

      setLocals({
        disabled_users,
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
  organizationsCheckOwnerRights,
  organizationsTransferOwnership,
  organizationsDisableUser,
  organizationsEnableUser,
};
