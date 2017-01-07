import hash from 'object-hash';
import {
  findLinkPermissionsById,
  findLinkByChecksum,
  findLinksFromIds,
  addPermissionsToALink,
  createLink,
} from './db_utils/links';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const linksGetByIds = (req, res, next) => {
  const {
    ids,
  } = res.locals;

  return findLinksFromIds(ids).then((links) => {
    const mappedLinks = ids.map((id) => {
      return links.find(l => l.short_url === id) || {};
    });
    res.locals.mappedLinks = mappedLinks;
    return next();
  });
};


const linksFindPermissions = (req, res, next) => {
  const {
    user_id,
    shortUrl,
    checksum,
    permission,
  } = res.locals;

  if (shortUrl) {
    findLinkPermissionsById(shortUrl)
      .then((results) => {
        if (results && results.length > 0) {
          const result = results[0];

          res.locals.permission = result.permission;
          res.locals.checksum = result.checksum;
          res.locals.meta = result.meta;

          return next();
        }

        return next(new SwipesError('There is no link with that id'));
      })
      .catch((err) => {
        return next(err);
      });
  }

  if (checksum) {
    findLinkByChecksum(checksum)
      .then((result) => {
        if (result) {
          res.locals.permission = Object.assign({}, { user_id }, permission);
          res.locals.checksum = result.checksum;
          res.locals.meta = result.meta;

          return next();
        }

        return next(new SwipesError('There is no link with that checksum'));
      })
      .catch((err) => {
        return next(err);
      });
  }
};

const linksAddPermission = (req, res, next) => {
  const {
    user_id,
    permission,
    checksum,
  } = res.locals;

  addPermissionsToALink({ user_id, checksum, permission })
    .then((result) => {
      res.locals.short_url = result.changes[0].new_val.id;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

const linksCreateMapLocals = (req, res, next) => {
  const {
    link,
    permission,
  } = res.locals;

  res.locals.service_name = link.service_name;
  res.locals.account_id = permission.account_id;

  return next();
};

const linksCreate = (req, res, next) => {
  const {
    link,
    meta,
  } = res.locals;

  const checksum = hash({ link });
  const insert_doc = Object.assign({ checksum }, link, { meta });

  createLink({ meta, insert_doc })
    .then((result) => {
      const changes = result.changes[0];
      const checksum = changes.new_val.checksum;
      const meta = changes.new_val.meta;

      res.locals.meta = meta;
      res.locals.checksum = checksum;

      return next();
    })
    .catch((error) => {
      return next(error);
    });
};

export {
  linksFindPermissions,
  linksGetByIds,
  linksAddPermission,
  linksCreateMapLocals,
  linksCreate,
};
