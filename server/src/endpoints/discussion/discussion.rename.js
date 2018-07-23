import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
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
  const { input } = res.locals;
  const {
    discussion_id,
    topic,
  } = input;
  const discussionQuery = dbUpdateQuery('discussions', discussion_id, {
    topic: shorten(topic, 60),
  });

  await dbRunQuery(discussionQuery);

  // Create response data.
  res.locals.output = {
    discussion_id,
    topic,
  };
});
