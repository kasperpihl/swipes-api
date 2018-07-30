import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbGetActiveUserIds from 'src/utils/db/dbGetActiveUserIds';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';

const expectedInput = {
  comment_id: string.require(),
  reaction: string,
};

export default endpointCreate({
  endpoint: '/comment.react',
  expectedInput,
}, async (req, res) => {
  // Get inputs
  const { user_id, organization_id } = res.locals;
  const {
    comment_id,
    reaction,
  } = res.locals.input;

  const q = dbUpdateQuery('comments', comment_id, {
              reactions: {
                [user_id]: reaction ? reaction : r.literal()
              }
            });
  const commentRes = await dbRunQuery(q);

  // Create response data.
  res.locals.output = {
    updates: [
      {
        type: 'comment',
        data: commentRes.changes[0].new_val,
      }
    ]
  };
}).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
