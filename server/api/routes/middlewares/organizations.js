import r from 'rethinkdb';
import {
  string,
} from 'valjs';
import {
  dbOrganizationsCreate,
  dbOrganizationsGetInfoFromInvitationToken,
} from './db_utils/organizations';
import {
  dbUsersAddOrganization,
} from './db_utils/users';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';

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

export {
  organizationsCreate,
  organizationsAddToUser,
  organizationsGetInfoFromInvitationToken,
};
