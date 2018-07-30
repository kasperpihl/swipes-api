import { string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbSendEvents from 'src/utils/db/dbSendEvents';
 
const expectedInput = {
  type: any.of('discussion', 'notification').require(),
  cleared_at: string.format('iso8601'),
};

export default endpointCreate({
  endpoint: '/me.clearCounter',
  expectedInput,
}, async (req, res, next) => {
  // Get inputs
  const { user_id } = res.locals;
  const {
    type,
    cleared_at,
  } = res.locals.input;

  const q = dbUpdateQuery('users', user_id, {
    settings: {
      [`${type}_counter_ts`]: cleared_at,
    },
  });

  await dbRunQuery(q);

  // Create response data.
  res.locals.output = {
    type,
    cleared_at,
  };
}).background(async (req, res) => {
  const { user_id } = res.locals;

  dbSendEvents({
    user_ids: [ user_id ],
    type: 'cleared_counter',
    data: res.locals.output,
  })
});
