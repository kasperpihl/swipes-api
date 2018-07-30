import { string } from 'valjs';
import r from 'rethinkdb';
import endpointCreate from 'src/utils/endpointCreate';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
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

  await dbRunQuery(discussionQuery);

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
      {
        type: 'discussion',
        data: discussion,
      }
    ]
  };

}).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
