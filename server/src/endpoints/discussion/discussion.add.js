import r from 'rethinkdb';
import { object, array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
//    "UVZWCJDHK"
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
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;
  const followers = input.followers || [];
  if(followers.indexOf(res.locals.user_id) === -1) {
    followers.push(res.locals.user_id);
  }

  const discussionQuery = dbInsertQuery('discussions', {
    id: idGenerate('D', 15),
    created_by: res.locals.user_id,
    topic: input.topic,
    context: input.context || null,
    last_comment_at: r.now(),
    privacy: input.privacy || 'public',
    organization_id: input.organization_id,
  });

  const discussionResult = await dbRunQuery(discussionQuery);
  const discussion = discussionResult.changes[0].new_val;

  const discussionFollowersQuery = dbInsertQuery('discussion_followers',
    followers.map((userId) => ({
    id: `${discussion.id}-${userId}`,
    user_id: userId,
    discussion_id: discussion.id,
    read_at: null,
    organization_id: input.organization_id,
  })));

  const followersRes = await dbRunQuery(discussionFollowersQuery);

  // Create response data.
  res.locals.output = { discussion, followers: followersRes.changes.map(o => o.new_val) };
});
