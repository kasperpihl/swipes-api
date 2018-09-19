import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';

const expectedInput = {
  discussion_id: string.require(),
};

export default endpointCreate({
  endpoint: '/discussion.unfollow',
  expectedInput,
}, async (req, res, next) => {
  // Get inputs
  const { user_id } = res.locals;
  const {
    discussion_id,
  } = res.locals.input;

  const removeFollowerQ = r.table('discussion_followers')
    .get(`${discussion_id}-${user_id}`)
    .delete();

  const updateDiscussionQ = dbUpdateQuery('discussions', discussion_id);


  await Promise.all([
    dbRunQuery(removeFollowerQ),
    dbRunQuery(updateDiscussionQ),
  ]);

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
    ],
  };
  res.locals.messageGroupId = discussion_id;
}).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
