import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';

const expectedInput = {
  discussion_id: string.min(1).require(),
  organization_id: string.min(1).require(),
};

export default endpointCreate({
  endpoint: '/discussion.archive',
  expectedInput,
}, async (req, res, next) => {
  // Get inputs
  const { input } = res.locals;
  const {
    discussion_id,
  } = input;
  const discussionQuery = dbUpdateQuery('discussions', discussion_id, {
    archived: true,
  });
  const discussionResult = await dbRunQuery(discussionQuery);

  // Create response data.
  res.locals.output = {
    updates: [
      { type: 'discussion', data: discussionResult.changes[0].new_val },
    ],
  };
  res.locals.messageGroupId = discussion_id;
}).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
