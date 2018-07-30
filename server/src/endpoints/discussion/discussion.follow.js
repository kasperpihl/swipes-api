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
}, async (req, res) => {
  // Get inputs
  const { user_id } = res.locals;
  const {
    discussion_id,
  } = res.locals.input;

  // Do queries and stuff here on the endpoint
  const followQ = dbInsertQuery('discussion_followers', {
    id: `${discussion_id}-${user_id}`,
    user_id: res.locals.user_id,
    discussion_id: discussion_id,
    read_at: r.table('discussions').get(discussion_id)('last_comment_at'),
  }, {
    conflict: 'update',
  });
  
  await dbRunQuery(followQ);
  // Things to the background
  res.locals.backgroundInput = {};

  // Create response data.
  res.locals.output = {};
});
