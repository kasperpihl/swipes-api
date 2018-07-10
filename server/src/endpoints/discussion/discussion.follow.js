import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
const expectedInput = {
  discussion_id: string.require(),
};
const expectedOutput = {};


export default endpointCreate({
  endpoint: '/discussion.follow',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Do queries and stuff here on the endpoint
  const followQ = dbInsertQuery('discussion_followers', {
    id: `${input.discussion_id}-${res.locals.user_id}`,
    user_id: res.locals.user_id,
    discussion_id: input.discussion_id,
    read_at: r.table('discussions').get(input.discussion_id)('last_comment_at'),
  }, {
    conflict: 'update',
  });
  
  const follower = await dbRunQuery(followQ);
  // Things to the background
  res.locals.backgroundInput = {};

  // Create response data.
  res.locals.output = {
    follower: follower.changes[0].new_val,
  };
});
