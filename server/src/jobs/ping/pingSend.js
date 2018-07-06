import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import queueCreateJob from 'src/utils/queue/queueCreateJob';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendEvents from 'src/utils/db/dbSendEvents';
import pushSend from 'src/utils/push/pushSend';

const expectedInput = {
  ping_id: string.require(),
  organization_id: string.require(),
};

export default queueCreateJob({
  eventName: 'pingSend',
  expectedInput,
}, async (req, res, next) => {
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
});
