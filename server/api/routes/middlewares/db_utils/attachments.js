import r from 'rethinkdb';
import {
  string,
  object,
  array,
  funcWrap,
} from 'valjs';
import db from '../../../../db';
import {
  SwipesError,
} from '../../../../middlewares/swipes-error';

const dbAttachmentsAdd = funcWrap([
  object.as({
    user_id: string.require(),
    target_id: string.require(),
    attachment: object.require(),
  }).require(),
], (err, { user_id, target_id, attachment }) => {
  if (err) {
    throw new SwipesError(`attachmentsAdd: ${err}`);
  }

  let table = '';

  if (target_id.startsWith('G')) {
    table = 'goals';
  }

  const q =
    r.db('swipes')
      .table(table)
      .get(target_id)
      .update({
        attachments: {
          [attachment.id]: attachment,
        },
        attachment_order: r.row('attachment_order').default([]).setUnion([attachment.id]),
        updated_at: r.now(),
        updated_by: user_id,
      }, {
        returnChanges: true,
      });

  return db.rethinkQuery(q);
});
const dbAttachmentsRename = funcWrap([
  object.as({
    user_id: string.require(),
    target_id: string.require(),
    attachment_id: string.require(),
    title: string.min(1).require(),
  }).require(),
], (err, { user_id, target_id, attachment_id, title }) => {
  if (err) {
    throw new SwipesError(`dbAttachmentsRename: ${err}`);
  }

  let table = '';

  if (target_id.startsWith('G')) {
    table = 'goals';
  }

  const q =
    r.db('swipes')
      .table(table)
      .get(target_id)
      .update({
        attachments: {
          [attachment_id]: {
            title,
            updated_at: r.now(),
            updated_by: user_id,
          },
        },
        updated_at: r.now(),
        updated_by: user_id,
      });

  return db.rethinkQuery(q);
});
const dbAttachmentsDelete = funcWrap([
  object.as({
    user_id: string.require(),
    target_id: string.require(),
    attachment_id: string.require(),
  }).require(),
], (err, { user_id, target_id, attachment_id }) => {
  if (err) {
    throw new SwipesError(`dbAttachmentsDelete: ${err}`);
  }

  let table = '';

  if (target_id.startsWith('G')) {
    table = 'goals';
  }

  const q =
    r.db('swipes')
      .table(table)
      .get(target_id)
      .update({
        attachments: {
          [attachment_id]: {
            deleted: true,
            updated_at: r.now(),
            updated_by: user_id,
          },
        },
        attachment_order: r.row('attachment_order').difference([attachment_id]),
        updated_at: r.now(),
        updated_by: user_id,
      });

  return db.rethinkQuery(q);
});
const dbAttachmentsReorder = funcWrap([
  object.as({
    user_id: string.require(),
    target_id: string.require(),
    attachment_order: array.require(),
  }).require(),
], (err, { user_id, target_id, attachment_order }) => {
  if (err) {
    throw new SwipesError(`dbAttachmentsReorder: ${err}`);
  }

  let table = '';

  if (target_id.startsWith('G')) {
    table = 'goals';
  }

  const q =
    r.table(table)
      .get(target_id)
      .update({
        attachment_order: r.row('attachments')
          // Find all the steps that are not deleted
          // mark the deleted one with null because rethink does not support returning
          // an empty value
          .do((attachments) => {
            return attachments.keys().map((key) => {
              return r.branch(
                attachments(key)('deleted').default(false).ne(true),
                attachments(key),
                null,
              );
            // Filter the null (deleted once)
            }).filter((item) => {
              return item.ne(null);
            });
          })
          // Map the steps to an array with ids
          .map((attachment) => {
            return attachment('id');
          })
          // Doing setUinion on the new step_order with the array that we made so far
          // will keep the order of the matching one and if there is some difference
          // it would be pushed at the end of the step_order
          .do((items) => {
            return r.expr(attachment_order).setUnion(items);
          }),
        updated_at: r.now(),
        updated_by: user_id,
      });

  return db.rethinkQuery(q);
});

export {
 dbAttachmentsAdd,
 dbAttachmentsRename,
 dbAttachmentsDelete,
 dbAttachmentsReorder,
};
