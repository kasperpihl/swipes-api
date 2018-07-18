import { object, array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import shorten from 'src/utils/shorten';

const expectedInput = {
  message: string.require(),
  context: object,
  attachments: array.of(object),
  privacy: any.of('public', 'private'),
  followers: array.of(string),
  organization_id: string.min(1).require(),
};
const expectedOutput = {
  discussion: object.require(),
};

export default endpointCreate({
  endpoint: '/discussion.add',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const { input, user_id } = res.locals;
  const {
    message,
    context,
    attachments,
    privacy,
    organization_id,
    followers,
  } = input;
  const uniqueFollowers = [...new Set(followers).add(user_id)];
  const discussionId = idGenerate('D', 15);
  const created_at = new Date();
  const discussionQuery = dbInsertQuery('discussions', {
    context,
    organization_id,
    created_at,
    id: discussionId,
    topic: shorten(message, 60),
    created_by: user_id,
    last_comment_at: created_at,
    privacy: privacy || 'public',
    archived: false,
  });
  const discussionFollowersQuery = dbInsertQuery(
    'discussion_followers',
    uniqueFollowers.map(userId => ({
      id: `${discussionId}-${userId}`,
      user_id: userId,
      discussion_id: discussionId,
      read_at: userId === user_id ? created_at : null,
      organization_id,
    })),
  );
  // Inserting the comment object.
  const commentQuery = dbInsertQuery('comments', {
    message,
    discussion_id: discussionId,
    sent_at: created_at,
    attachments: attachments || [],
    sent_by: user_id,
    organization_id,
  });
  const discussionResult = await dbRunQuery(discussionQuery);
  const discussion = discussionResult.changes[0].new_val;
  const followersResult = await dbRunQuery(discussionFollowersQuery);
  const commentResult = await dbRunQuery(commentQuery);

  // Create response data.
  res.locals.output = {
    discussion,
    followers: followersResult.changes.map(o => o.new_val),
  };
});
