import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';

const expectedInput = {
  discussion_id: string.require(),
};
const expectedOutput = {};


export default endpointCreate({
  endpoint: '/discussion.follow',
  expectedInput,
  expectedOutput,
}, async (req, res) => {
  // Get inputs
  const { user_id } = res.locals;
  const {
    discussion_id,
  } = res.locals.input;

  // Do queries and stuff here on the endpoint
  const addFollowerQ = dbInsertQuery('discussion_followers', {
    id: `${discussion_id}-${user_id}`,
    user_id: res.locals.user_id,
    discussion_id: discussion_id,
    read_at: r.table('discussions').get(discussion_id)('last_comment_at'),
  }, {
    conflict: 'update',
  });
  
  const updateDiscussionQ = dbUpdateQuery('discussions', discussion_id)


  await Promise.all([
    dbRunQuery(addFollowerQ),
    dbRunQuery(updateDiscussionQ)
  ])

  const q = r.table('discussions')
            .get(discussion_id)
            .merge(obj => ({
              followers: r.table('discussion_followers')
                .getAll(obj('id'), { index: 'discussion_id' })
                .pluck('user_id', 'read_at')
                .coerceTo('array'),
            }));

  const discussion = await dbRunQuery(q);

  // Create response data.
  res.locals.output = {
    updates: [
      { type: 'discussion', data: discussion },
    ]
  };
});
