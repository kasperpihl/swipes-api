import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  discussion_id: string.require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/discussion.unfollow',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  const q = r.table('discussion_followers')
              .get(`${input.discussion_id}-${res.locals.user_id}`)
              .delete();

  await dbRunQuery(q);
  // Create response data.
  res.locals.output = {};
});
