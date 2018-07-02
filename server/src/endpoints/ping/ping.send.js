import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import endpointCreate from 'src/utils/endpointCreate';

export default endpointCreate({
  endpoint: '/ping.send',
  expectedInput: {
    receivers: array.of(string).require(),
    message: string.min(1).require(),
    attachments: array.of(object),
    organization_id: string.require(),
  },
  expectedOutput: {
    ping: object.require()
  }
}, async (req, res, next) => {
  const input = res.locals.input;

  // Generate insert query to pings table
  const pingQuery = dbInsertQuery('pings', {
    created_by: res.locals.user_id,
    sent_at: r.now(),
    receivers: input.receivers,
    message: input.message,
    attachments: input.attachments || [],
    organization_id: input.organization_id,
  });

  // Execute pings table query
  const pingResult = await dbRunQuery(pingQuery);
  const ping = pingResult.changes[0].new_val;

  // Create ping_receiver object as a multi insert query
  const pingReceiverQuery = dbInsertQuery('ping_receivers', input.receivers.map((rId) => ({
    ping_id: ping.id,
    sent_at: ping.sent_at,
    received_by: rId,
    thanked_at: null,
    read_at: null,
    organization_id: input.organization_id,
  })));

  // Execute the ping_receivers query 
  const pingReceiverResult = await dbRunQuery(pingReceiverQuery);

  // Create response data.
  res.locals.responseData = {
    ping,
  };
})