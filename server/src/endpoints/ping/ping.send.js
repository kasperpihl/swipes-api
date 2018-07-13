import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import endpointCreate from 'src/utils/endpointCreate';
import queueSendJob from 'src/utils/queue/queueSendJob';
import dbSendEvents from 'src/utils/db/dbSendEvents';
import pushSend from 'src/utils/push/pushSend';
import idGenerate from 'src/utils/idGenerate';

const expectedInput = {
  receivers: array.of(string).require(),
  message: string.min(1).require(),
  attachments: array.of(object),
  organization_id: string.require(),
};
const expectedOutput = {
  ping: object.require(),
};

export default endpointCreate({
  endpoint: '/ping.send',
  expectedInput,
  expectedOutput,
}, async (req, res) => {
  const input = res.locals.input;

  // Generate insert query to pings table
  const pingQuery = dbInsertQuery('pings', {
    id: idGenerate('P', 15),
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
    id: `${ping.id}-${rId}`,
    ping_id: ping.id,
    sent_at: ping.sent_at,
    received_by: rId,
    thanked_at: null,
    read_at: null,
    organization_id: input.organization_id,
  })));

  // Execute the ping_receivers query 
  const pingReceiverResult = await dbRunQuery(pingReceiverQuery);

  res.locals.backgroundInput = {
    ping_id: ping.id,
    organization_id: input.organization_id,
  };
  
  // Create response data.
  res.locals.output = {
    ping,
  };
}).background(async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Fetch the ping object
  const ping = await dbRunQuery(
    r.table('pings').get(input.ping_id)
  );

  // Send events to both sender and receivers
  await dbSendEvents([{
    user_ids: [ping.created_by],
    type: 'ping_sent',
    data: {
      ping_id: input.ping_id,
    },
  }, {
    user_ids: ping.receivers,
    type: 'ping_received',
    data: {
      ping_id: input.ping_id,
    }
  }]);

  // Fetch sender (to have the name)
  const sender = await dbRunQuery(
    r.table('users')
      .get(ping.created_by)
      .pluck('profile')
  );

  // Fire push to all the receivers.
  await pushSend({
    orgId: input.organization_id,
    users: ping.receivers,
    targetId: ping.id,
    targetType: 'ping',
  }, {
    content: ping.message,
    heading: `${sender.profile.first_name} pinged you`,
  });
})