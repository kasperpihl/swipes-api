import dbUsersGetSingleWithOrganizations from '../db_utils/users';

const usersGetSingleWithOrganizations = (req, res, next) => {
  const {
    user_id,
  } = res.locals;

  return dbUsersGetSingleWithOrganizations({ user_id })
    .then((user) => {
      res.locals.user = user;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

export {
  usersGetSingleWithOrganizations,
};
