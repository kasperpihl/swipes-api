import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  discussion_id: string.min(1).require(),
  organization_id: string.min(1).require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/discussion.archive',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const { input } = res.locals;
  const {
    discussion_id,
    organization_id,
  } = input;
  const discussionQuery = dbUpdateQuery('discussions', discussion_id, {
    archived: true,
    updated_at: r.now(),
  });
  const discussionResult = await dbRunQuery(discussionQuery);

  // Create response data.
  res.locals.output = {
    discussion_id,
    organization_id,
  };
});
