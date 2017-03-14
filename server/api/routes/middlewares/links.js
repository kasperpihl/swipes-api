import hash from 'object-hash';
import {
  string,
  array,
  object,
} from 'valjs';
import {
  findLinkPermissionsById,
  findLinksFromIds,
  addPermissionsToALink,
  createLink,
} from './db_utils/links';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';
import {
  valLocals,
} from '../../utils';
import {
  service,
  linkPermission,
  linkMeta,
} from '../../validators';

const linksGetByIds = valLocals('linksGetByIds', {
  ids: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    ids,
  } = res.locals;

  return findLinksFromIds(ids).then((links) => {
    const mappedLinks = ids.map((id) => {
      return links.find(l => l.short_url === id) || {};
    });

    setLocals({
      link: mappedLinks,
    });

    return next();
  });
});
const linksFindPermissions = valLocals('linksFindPermissions', {
  short_url: string.require(),
}, (req, res, next, setLocals) => {
  const {
    short_url,
  } = res.locals;

  if (short_url) {
    findLinkPermissionsById(short_url)
      .then((results) => {
        if (results && results.length > 0) {
          const result = results[0];

          setLocals({
            link_with_permission: result,
          });

          return next();
        }

        return next(new SwipesError('There is no link with that id'));
      })
      .catch((err) => {
        return next(err);
      });
  }
});

const linksAddPermission = valLocals('linksAddPermission', {
  user_id: string.require(),
  link: object.require(),
  permission: linkPermission,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    permission,
    link,
  } = res.locals;

  addPermissionsToALink({ user_id, checksum: link.checksum, permission })
    .then((result) => {
      setLocals({
        short_url: result.changes[0].new_val.id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

const linksCreate = valLocals('linksCreate', {
  link: object.as({
    service,
    permission: linkPermission,
    meta: linkMeta,
  }).require(),
}, (req, res, next, setLocals) => {
  const {
    link,
  } = res.locals;
  const {
    service,
    meta,
    permission,
  } = link;

  const checksum = hash({ service });
  const insert_doc = Object.assign({ checksum }, { service, meta });

  createLink({ meta, insert_doc })
    .then((result) => {
      const insertedObj = result.changes[0].new_val;

      setLocals({
        link: insertedObj,
        permission,
      });

      return next();
    })
    .catch((error) => {
      return next(error);
    });
});

export {
  linksFindPermissions,
  linksGetByIds,
  linksAddPermission,
  linksCreate,
};
