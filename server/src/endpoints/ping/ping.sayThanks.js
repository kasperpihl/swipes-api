import r from 'rethinkdb';
import { string, date } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import pushSend from 'src/utils/push/pushSend';

const expectedInput = {
  receiver_id: string.require(),
};
const expectedOutput = {
  thanked_at: date.require(),
};

export default endpointCreate({
  endpoint: '/ping.sayThanks',
  expectedInput,
  expectedOutput,
}, async (req, res) => {
  // Get inputs
  const input = res.locals.input;
  await pushSend({});

  const query = r.table('ping_receivers')
                  .get(input.receiver_id)
                  .update(receiver => r.branch(
                    receiver('received_by').eq(res.locals.user_id),
                    {
                      thanked_at: r.now(),
                      updated_at: r.now(),
                    },
                    receiver,
                  ), {
                    returnChanges: true,
                  });

  const result = await dbRunQuery(query);

  if(result.unchanged || result.skipped) {
    throw Error('Unauthorized access');
  }

  // Create response data.
  res.locals.responseData = {
    thanked_at: result.changes[0].new_val.thanked_at,
  };
});
