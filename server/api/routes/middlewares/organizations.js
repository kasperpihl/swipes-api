import r from 'rethinkdb';
import {
  string,
} from 'valjs';
import {
  dbOrganizationsCreate,
  dbOrganizationsGetAllUsersWithFields,
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
const organizationsGetAllUsers = valLocals('organizationsGetAllUsers', {
  organizationId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    organizationId,
  } = res.locals;
  const fields = ['id', 'first_name', 'last_name', 'avatar'];

  dbOrganizationsGetAllUsersWithFields({ organization_id: organizationId, fields })
    .then((users) => {
      setLocals({
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
  organizationsGetAllUsers,
};
