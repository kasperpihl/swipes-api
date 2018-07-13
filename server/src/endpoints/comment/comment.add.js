import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';

const expectedInput = {
  discussion_id: string.require(),
  message: string.require(),
  attachments: array.of(object),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/comment.add',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Inserting the comment object.
  const commentQ = dbInsertQuery('comments', {
    discussion_id: input.discussion_id,
    message: input.message,
    attachments: input.attachments || [],
    sent_at: r.now(),
    sent_by: res.locals.user_id,
    organization_id: input.organization_id,
  });

  const commentRes = await dbRunQuery(commentQ);
  const comment = commentRes.changes[0].new_val;
  
  // Updating read_at to be newest comment.
  // Also ensuring that user follows discussion
  const followerQ = dbInsertQuery('discussion_followers', {
    id: `${input.discussion_id}-${res.locals.user_id}`,
    user_id: res.locals.user_id,
    discussion_id: input.discussion_id,
    read_at: comment.sent_at,
    organization_id: input.organization_id,
  }, {
    conflict: 'update',
  });

  const discQ = r.table('discussions')
                  .get(input.discussion_id)
                  .update({
                    last_comment_at: comment.sent_at
                  })
                  // T_TODO: update only if comment.sent_at is greater than existing value
  const follower = await dbRunQuery(followerQ);
  const discussion = await dbRunQuery(discQ);

  // Create response data.
  res.locals.output = {
    comment,
    follower,
    discussion,
  };

});
