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
const expectedOutput = {
  discussion_id: string.require(),
  topic: string.require(),
};

export default endpointCreate({
  endpoint: '/discussion.rename',
  expectedInput,
  expectedOutput,
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

  await dbRunQuery(discussionQuery);

  // Create response data.
  res.locals.output = {
    discussion_id,
    topic,
  };

  res.locals.backgroundInput = {
    organization_id,
    discussion_id,
    topic,
  };

}).background(async (req, res) => {

  const {
    discussion_id,
    topic,
    organization_id
  } = res.locals.input;

  const user_ids = await dbGetActiveUserIds(organization_id);

  dbSendEvents({
    user_ids,
    type: 'update',
    data: {
      updates: [
        {
          type: 'discussion',
          data: {
            id: discussion_id,
            topic,
          }
        }
      ]
    },
  })
});
