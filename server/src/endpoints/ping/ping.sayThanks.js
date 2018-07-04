import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  receiver_id: string.require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/ping.sayThanks',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  const query = r.table('ping_receivers')
                  .get(input.receiver_id)
                  .update(receiver => r.branch(
                    receiver('received_by').eq(res.locals.user_id),
                    { thanked_at: r.now() },
                    receiver,
                  ));

  const result = await dbRunQuery(query);
  // Create response data.
  res.locals.responseData = { result };
});
