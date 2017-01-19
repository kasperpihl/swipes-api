import hash from 'object-hash';
import {
  findLinkPermissionsById,
  // findLinkByChecksum,
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
    res.locals.returnObj.links = mappedLinks;
    return next();
  });
};
// T_TODO optimize that
const linksGetById = (req, res, next) => {
  const {
    short_url,
  } = res.locals;

  const ids = [short_url];

  return findLinksFromIds(ids).then((links) => {
    const mappedLinks = ids.map((id) => {
      return links.find(l => l.short_url === id) || {};
    });

    res.locals.returnObj.link = mappedLinks[0];

    return next();
  });
};
const linksFindPermissions = (req, res, next) => {
  const {
    // user_id,
    short_url,
    // checksum,
    // permission,
  } = res.locals;

  if (short_url) {
    findLinkPermissionsById(short_url)
      .then((results) => {
        if (results && results.length > 0) {
          const result = results[0];

          res.locals.link_with_permission = result;

          return next();
        }

        return next(new SwipesError('There is no link with that id'));
      })
      .catch((err) => {
        return next(err);
      });
  }

  // if (checksum) {
  //   findLinkByChecksum(checksum)
  //     .then((result) => {
  //       if (result) {
  //         res.locals.permission = Object.assign({}, { user_id }, permission);
  //         res.locals.checksum = result.checksum;
  //         res.locals.meta = result.meta;
  //
  //         return next();
  //       }
  //
  //       return next(new SwipesError('There is no link with that checksum'));
  //     })
  //     .catch((err) => {
  //       return next(err);
  //     });
  // }
};

const linksAddPermission = (req, res, next) => {
  const {
    user_id,
    permission,
    checksum,
  } = res.locals;

  addPermissionsToALink({ user_id, checksum, permission })
    .then((result) => {
      res.locals.returnObj.short_url = result.changes[0].new_val.id;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

const linksCreate = (req, res, next) => {
  const {
    service,
    meta,
  } = res.locals;

  const checksum = hash({ service });
  const insert_doc = Object.assign({ checksum }, { service, meta });

  createLink({ meta, insert_doc })
    .then((result) => {
      const insertedObj = result.changes[0].new_val;
      res.locals.checksum = insertedObj.checksum;
      delete insertedObj.checksum;
      res.locals.returnObj.link = insertedObj;

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
  linksCreate,
  linksGetById,
};
