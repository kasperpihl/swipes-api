import r from 'rethinkdb';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbAttachmentsAdd,
  dbAttachmentsRename,
  dbAttachmentsDelete,
  dbAttachmentsReorder,
} from './db_utils/steps';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';

const attachmentsAdd = valLocals('attachmentsAdd', {
  user_id: string.require(),
  target_id: string.require(),
  short_url: string.require(),
  link: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    short_url,
    link,
  } = res.locals;

  link.permission = {
    short_url,
  };

  const attachment = {
    id: generateSlackLikeId('', 6),
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    updated_by: user_id,
  };

  dbAttachmentsAdd({ user_id, target_id, attachment })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        attachment,
        attachment_order: changes.new_val.attachment_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const attachmentsRename = valLocals('attachmentsRename', {
  user_id: string.require(),
  target_id: string.require(),
  attachment_id: string.require(),
  title: string.min(1).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    attachment_id,
    title,
  } = res.locals;

  dbAttachmentsRename({ user_id, target_id, attachment_id, title })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const attachmentsDelete = valLocals('attachmentsDelete', {
  user_id: string.require(),
  target_id: string.require(),
  attachment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    attachment_id,
  } = res.locals;

  dbAttachmentsDelete({ user_id, target_id, attachment_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const attachmentsReorder = valLocals('attachmentsReorder', {
  user_id: string.require(),
  target_id: string.require(),
  attachment_order: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    attachment_order,
  } = res.locals;

  dbAttachmentsReorder({ user_id, target_id, attachment_order })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  attachmentsAdd,
  attachmentsRename,
  attachmentsDelete,
  attachmentsReorder,
};