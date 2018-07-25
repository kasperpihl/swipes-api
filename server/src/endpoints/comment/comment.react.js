import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbGetActiveUserIds from 'src/utils/db/dbGetActiveUserIds';
import dbSendEvents from 'src/utils/db/dbSendEvents';

const expectedInput = {
  comment_id: string.require(),
  reaction: string,
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/comment.react',
  expectedInput,
  expectedOutput,
}, async (req, res) => {
  // Get inputs
  const { user_id, organization_id } = res.locals;
  const {
    comment_id,
    reaction,
  } = res.locals.input;

  const q = r.table('comments')
            .get(comment_id)
            .update(comment => ({
              reactions: {
                [user_id]: reaction ? reaction : r.literal()
              }
            }))
  await dbRunQuery(q);

  res.locals.backgroundInput = {
    comment_id,
    organization_id,
  }
  // Create response data.
  res.locals.output = {};
}).background(async (req, res) => {
  // K_TODO: Send event to followers

  const {
    comment_id,
    organization_id,
  } = res.locals.input;

  const user_ids = await dbGetActiveUserIds(organization_id);
  const comment = await dbRunQuery(r.table('comments').get(comment_id));

  dbSendEvents({
    user_ids,
    type: 'update',
    data: {
      updates: [
        {
          type: 'comment',
          id: comment_id,
          data: {
            discussion_id: comment.discussion_id,
            reactions: comment.reactions,
          }
        }
      ]
    },
  })
});
