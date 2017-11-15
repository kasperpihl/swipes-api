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
} from './db_utils/attachments';
import {
  attachmentsCreateAttachment,
} from './utils';
import {
  valLocals,
} from '../../utils';

const attachmentsCreate = valLocals('attachmentsCreate', {
  user_id: string.require(),
  link: object.require(),
  title: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    link,
    title,
  } = res.locals;

  const attachment = attachmentsCreateAttachment({
    user_id,
    link,
    title: title || link.meta.title,
  });

  setLocals({
    attachment,
  });

  return next();
});
const attachmentsInsert = valLocals('attachmentsInsert', {
  target_id: string.require(),
  attachment: object.require(),
}, (req, res, next, setLocals) => {
  const {
    target_id,
    attachment,
  } = res.locals;

  dbAttachmentsAdd({ target_id, attachment })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        attachment: changes.new_val.attachments[attachment.id],
        attachment_order: changes.new_val.attachment_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const attachmentsAddQueueMessage = valLocals('attachmentsAddQueueMessage', {
  user_id: string.require(),
  target_id: string.require(),
  attachment: object.require(),
  attachment_order: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    attachment,
    attachment_order,
  } = res.locals;
  const queueMessage = {
    user_id,
    target_id,
    attachment,
    attachment_order,
    event_type: 'attachment_added',
  };

  setLocals({
    queueMessage,
    messageGroupId: target_id,
  });

  return next();
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

  dbAttachmentsRename({
    user_id, target_id, attachment_id, title,
  })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const attachmentsRenameQueueMessage = valLocals('attachmentsRenameQueueMessage', {
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
  const queueMessage = {
    user_id,
    target_id,
    attachment_id,
    title,
    event_type: 'attachment_renamed',
  };

  setLocals({
    queueMessage,
    messageGroupId: target_id,
  });

  return next();
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
const attachmentsDeleteQueueMessage = valLocals('attachmentsDeleteQueueMessage', {
  user_id: string.require(),
  target_id: string.require(),
  attachment_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    attachment_id,
  } = res.locals;
  const queueMessage = {
    user_id,
    target_id,
    attachment_id,
    event_type: 'attachment_deleted',
  };

  setLocals({
    queueMessage,
    messageGroupId: target_id,
  });

  return next();
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
const attachmentsReorderQueueMessage = valLocals('attachmentsReorderQueueMessage', {
  user_id: string.require(),
  target_id: string.require(),
  attachment_order: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    target_id,
    attachment_order,
  } = res.locals;
  const queueMessage = {
    user_id,
    target_id,
    attachment_order,
    event_type: 'attachment_reordered',
  };

  setLocals({
    queueMessage,
    messageGroupId: target_id,
  });

  return next();
});

export {
  attachmentsCreate,
  attachmentsInsert,
  attachmentsRename,
  attachmentsDelete,
  attachmentsReorder,
  attachmentsAddQueueMessage,
  attachmentsRenameQueueMessage,
  attachmentsDeleteQueueMessage,
  attachmentsReorderQueueMessage,
};
