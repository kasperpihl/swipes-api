import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import idGenerate from 'src/utils/idGenerate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';


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
  // Inserting the comment object.
  const insertCommentQ = dbInsertQuery('comments', {
    id: `${discussion_id}-${idGenerate('C', 7)}`,
    discussion_id,
    message,
    sent_at: r.now(),
    attachments: attachments || [],
    sent_by: user_id,
    reactions: {},
    organization_id,
  });


  const commentRes = await dbRunQuery(insertCommentQ);
  const comment = commentRes.changes[0].new_val;
  
  // Updating read_at to be newest comment.
  // Also ensuring that user follows discussion
  const updateFollowerQ = dbInsertQuery('discussion_followers', {
    user_id,
    id: `${discussion_id}-${user_id}`,
    discussion_id,
    read_at: comment.sent_at,
    organization_id,
  }, {
    conflict: 'update',
  });
  
  // T_TODO: update only if comment.sent_at is greater than existing value
  // And update the discussion to include latest comment.
  const updateDiscussionQ = dbUpdateQuery('discussions', discussion_id, {
    last_comment_at: comment.sent_at,
    last_comment: message.slice(0, 100),
    last_comment_by: user_id,
  });

  const result = await Promise.all([
    dbRunQuery(updateFollowerQ),
    dbRunQuery(updateDiscussionQ)
  ]);

  const discussion = result[1].changes[0].new_val;

  // Fetch the latest followers to ensure they're up to date.
  const followersQ = r.table('discussion_followers')
                      .getAll(discussion_id, { index: 'discussion_id' })
                      .pluck('user_id', 'read_at')

  discussion.followers = await dbRunQuery(followersQ);

  // Create response data.
  res.locals.output = {
    updates: [
      { type: 'comment', data: comment },
      { type: 'discussion', data: discussion },
    ],
  };
  res.locals.backgroundInput = res.locals.output;
}).background(async (req, res) => {
  
});
