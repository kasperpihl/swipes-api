import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendEvents from 'src/utils/db/dbSendEvents';
import dbGetActiveUserIds from 'src/utils/db/dbGetActiveUserIds';
import shorten from 'src/utils/shorten';

const expectedInput = {
  organization_id: string.require(),
  discussion_id: string.require(),
  topic: string.min(1).require(),
};

export default endpointCreate({
  endpoint: '/discussion.rename',
  expectedInput,
}, async (req, res, next) => {
  // Get inputs
  const { organization_id } = res.locals;
  const {
    discussion_id,
    topic,
  } = res.locals.input;
  const discussionQuery = dbUpdateQuery('discussions', discussion_id, {
    topic: shorten(topic, 60),
  });

  const discussionRes = await dbRunQuery(discussionQuery);

  // Create response data.
  res.locals.output = {
    updates: [
      {
        type: 'discussion',
        data: discussionRes.changes[0].new_val,
      }
    ]
  };

  res.locals.backgroundInput = {
    updates: res.locals.output.updates,
    organization_id,
  };

}).background(async (req, res) => {

  const {
    updates,
    organization_id
  } = res.locals.input;

  const user_ids = await dbGetActiveUserIds(organization_id);

  dbSendEvents({
    user_ids,
    type: 'update',
    data: {
      updates,
    },
  })
});
