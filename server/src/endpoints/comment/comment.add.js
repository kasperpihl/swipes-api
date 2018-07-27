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
}, async (req, res, next) => {
  // Get inputs
  const {
    input,
    user_id,
  } = res.locals;
  const {
    discussion_id,
    message,
    attachments,
    organization_id,
  } = input;
  const sent_at = new Date();
  // Inserting the comment object.
  const commentQ = dbInsertQuery('comments', {
    discussion_id,
    message,
    sent_at,
    attachments: attachments || [],
    sent_by: user_id,
    reactions: {},
    organization_id,
  });
  // Updating read_at to be newest comment.
  // Also ensuring that user follows discussion
  const followerQ = dbInsertQuery('discussion_followers', {
    user_id,
    id: `${discussion_id}-${user_id}`,
    discussion_id,
    read_at: sent_at,
    organization_id,
  }, {
    conflict: 'update',
  });
  // T_TODO: update only if comment.sent_at is greater than existing value
  const discQ = r.table('discussions')
    .get(discussion_id)
    .update({
      last_comment_at: sent_at,
      last_comment: message.slice(0, 100),
      last_comment_by: user_id,
    }, {
      return_changes: true,
    })

  const followersQ = r.table('discussion_followers')
                      .getAll(discussion_id, { index: 'discussion_id' })
                      .pluck('user_id', 'read_at')

  // T_TODO would be nice if we can run some of those together
  const commentRes = await dbRunQuery(commentQ);
  // T_TODO what exactly we want to return here
  await dbRunQuery(followerQ);
  const discussionRes = await dbRunQuery(discQ);

  const followersRes = await dbRunQuery(followersQ);

  const comment = commentRes.changes[0].new_val;
  const discussion = discussionRes.changes[0].new_val;
  discussion.followers = followersRes;

  // Create response data.
  res.locals.output = {
    comment,
    discussion: discussion,
  };
});
