import r from 'rethinkdb';
import { object, array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  topic: string.min(1).require(),
  context: object,
  privacy: any.of('public', 'private'),
  followers: array.of(string),
  organization_id: string.min(1).require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/discussion.add',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const { input, user_id } = res.locals;
  const {
    topic,
    context,
    privacy,
    organization_id,
    followers,
  } = input;
  const uniqueFollowers = [...new Set(followers).add(user_id)];
  const discussionId = idGenerate('D', 15);
  const discussionQuery = dbInsertQuery('discussions', {
    topic,
    context,
    organization_id,
    id: discussionId,
    created_at: r.now(),
    created_by: user_id,
    last_comment_at: r.now(),
    privacy: privacy || 'public',
    archived: false,
  });
  const discussionFollowersQuery = dbInsertQuery(
    'discussion_followers',
    uniqueFollowers.map(userId => ({
      id: `${discussionId}-${userId}`,
      user_id: userId,
      discussion_id: discussionId,
      read_at: null,
      organization_id,
    })),
  );
  const discussionResult = await dbRunQuery(discussionQuery);
  const discussion = discussionResult.changes[0].new_val;
  const followersRes = await dbRunQuery(discussionFollowersQuery);

  // Create response data.
  res.locals.output = {
    discussion,
    followers: followersRes.changes.map(o => o.new_val),
  };
});
