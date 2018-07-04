import r from 'rethinkdb';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbWaysInsertSingle,
  dbWaysUpdateSingle,
  dbWaysGetSingle,
} from './db_utils/ways';
import {
  attachmentsCreateAttachment,
  stepsCreateStep,
} from './utils';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const waysCreate = valLocals('waysCreate', {
  user_id: string.require(),
  title: string.require(),
  organization_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    title,
    organization_id,
    goal,
  } = res.locals;
  const way = {
    title,
    goal,
    organization_id,
    id: generateSlackLikeId('W'),
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    archived: false,
  };

  setLocals({
    way,
  });

  return next();
});
const waysInsert = valLocals('waysInsert', {
  way: object.require(),
}, (req, res, next, setLocals) => {
  const {
    way,
  } = res.locals;

  dbWaysInsertSingle({ way })
    .then((obj) => {
      setLocals({
        eventType: 'way_created',
        way,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const waysArchive = valLocals('waysArchive', {
  id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    id,
  } = res.locals;
  const properties = {
    archived: true,
  };

  dbWaysUpdateSingle({ id, properties })
    .then(() => {
      setLocals({
        eventType: 'way_archived',
        id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const waysCreateQueueMessage = valLocals('waysCreateQueueMessage', {
  user_id: string.require(),
  way: object.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    way,
    eventType,
  } = res.locals;
  const way_id = way.id;
  const queueMessage = {
    user_id,
    way_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: way_id,
  });

  return next();
});
const waysArchiveQueueMessage = valLocals('waysArchiveQueueMessage', {
  user_id: string.require(),
  id: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    way_id: id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: id,
  });

  return next();
});
const waysGetSingle = valLocals('waysArchiveQueueMessage', {
  way_id: string,
}, (req, res, next, setLocals) => {
  const {
    way_id,
  } = res.locals;

  dbWaysGetSingle({ way_id })
    .then((way) => {
      setLocals({
        way,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const waysCopyAttachments = valLocals('waysCopyAttachments', {
  notes: array.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    notes,
    goal,
  } = res.locals;
  const {
    attachment_order,
    attachments,
  } = goal;
  const newAttachments = {};
  const notesMap = {};

  notes.forEach((note) => {
    notesMap[note.id] = note;
  });

  attachment_order.forEach((attachmentId) => {
    const attachment = attachments[attachmentId];
    let newAttachment = {};

    if (attachment.link.service.type === 'note') {
      newAttachment = {
        link: {
          service: {
            type: 'note',
          },
        },
        text: notesMap[attachment.link.service.id].text,
        title: attachment.title,
      };
    } else {
      newAttachment = {
        link: attachment.link,
        title: attachment.title,
      };
    }

    newAttachments[attachmentId] = newAttachment;
  });

  goal.attachments = newAttachments;

  setLocals({
    goal,
  });

  return next();
});
const waysCopySteps = valLocals('waysCopySteps', {
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    goal,
  } = res.locals;
  const {
    step_order,
    steps,
  } = goal;
  const newSteps = {};

  step_order.forEach((stepId) => {
    const step = {
      assignees: steps[stepId].assignees,
      title: steps[stepId].title,
    };

    newSteps[stepId] = step;
  });

  goal.steps = newSteps;

  setLocals({
    goal,
  });

  return next();
});
const waysModifyStepsAndAttachmentsInWay = valLocals('waysModifyStepsAndAttachmentsInWay', {
  user_id: string.require(),
  way: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    way,
  } = res.locals;
  const {
    step_order,
    steps,
    attachment_order,
    attachments,
  } = way.goal;

  const newAttachments = {};
  const newAttachmentOrder = [];
  const newSteps = {};
  const newStepOrder = [];

  step_order.forEach((stepId) => {
    const step = stepsCreateStep({
      user_id,
      ...steps[stepId],
    });

    newStepOrder.push(step.id);
    newSteps[step.id] = step;
  });

  attachment_order.forEach((attachmentId) => {
    const attachment = attachmentsCreateAttachment({
      user_id,
      ...attachments[attachmentId],
    });

    newAttachmentOrder.push(attachment.id);
    newAttachments[attachment.id] = attachment;
  });

  way.goal.step_order = newStepOrder;
  way.goal.steps = newSteps;
  way.goal.attachment_order = newAttachmentOrder;
  way.goal.attachments = newAttachments;

  setLocals({
    way,
  });

  return next();
});
const waysGetNoteContentFromWayAttachmets = valLocals('waysGetNoteContentFromWayAttachmets', {
  way: object.require(),
}, (req, res, next, setLocals) => {
  const {
    way,
  } = res.locals;
  const {
    attachment_order,
    attachments,
  } = way.goal;

  const texts = [];
  // Need this in the same order as texts to use it later for creating links
  const notesAttachment = [];

  attachment_order.forEach((attachmentId) => {
    if (attachments[attachmentId].link.service.type === 'note') {
      texts.push(attachments[attachmentId].text);
      notesAttachment.push(attachments[attachmentId]);
    }
  });

  setLocals({
    texts,
    notesAttachment,
  });

  return next();
});
const waysModifyNotesContentInWayAttachments = valLocals('waysModifyNotesContentInWayAttachments', {
  way: object.require(),
  links: array.require(),
}, (req, res, next, setLocals) => {
  const {
    way,
    links,
  } = res.locals;
  const {
    attachment_order,
    attachments,
  } = way.goal;
  let linkIdx = 0;

  attachment_order.forEach((attachmentId) => {
    if (attachments[attachmentId].link.service.type === 'note') {
      attachments[attachmentId].link = links[linkIdx];
      delete attachments[attachmentId].text;
      linkIdx += 1;
    }
  });

  way.attachments = attachments;

  setLocals({
    way,
  });

  return next();
});

export {
  waysCreate,
  waysGetSingle,
  waysInsert,
  waysArchive,
  waysCreateQueueMessage,
  waysArchiveQueueMessage,
  waysCopyAttachments,
  waysCopySteps,
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  waysModifyNotesContentInWayAttachments,
};
