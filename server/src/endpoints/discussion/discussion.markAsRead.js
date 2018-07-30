import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';

const expectedInput = {
  discussion_id: string.require(),
  read_at: string.format('iso8601'),
};

export default endpointCreate({
  endpoint: '/discussion.markAsRead',
  expectedInput,
}, async (req, res) => {
  // Get inputs
  const { user_id } = res.locals;
  const {
    discussion_id,
    read_at,
  } = res.locals.input;

  // Do queries and stuff here on the endpoint
  const addFollowerQ = dbUpdateQuery('discussion_followers', `${discussion_id}-${user_id}`, {
    read_at: read_at,
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
