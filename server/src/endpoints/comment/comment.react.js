import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  comment_id: string.require(),
  reaction: string,
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/comment.react',
  expectedInput,
  expectedOutput,
}, async (req, res) => {
  // Get inputs
  const { user_id } = res.locals;
  const {
    comment_id,
    reaction,
  } = res.locals.input;

  const q = r.table('comments')
            .get(comment_id)
            .update(comment => ({
              reactions: {
                [user_id]: reaction ? reaction : r.literal()
              }
            }))
  await dbRunQuery(q);

  // Create response data.
  res.locals.output = {};
}).background(async (req, res) => {
  // K_TODO: Send event to followers
});
