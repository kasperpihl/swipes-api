import { string } from 'valjs';
import r from 'rethinkdb';
import endpointCreate from 'src/utils/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import shorten from 'src/utils/shorten';
import mentionsClean from 'src/utils/mentions/mentionsClean';

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
  const {
    discussion_id,
    topic,
    organization_id,
  } = res.locals.input;
  const {
    user_id,
  } = res.locals;

  const fetchUserFirstNameQ = r.table('users').get(user_id).pluck('profile');
  const user = await dbRunQuery(fetchUserFirstNameQ);

  const insertCommentQ = dbInsertQuery('comments', {
    id: `${discussion_id}-${idGenerate('C', 7)}`,
    discussion_id,
    message: `${user.profile.first_name} renamed the topic to '${topic}'`,
    sent_at: r.now(),
    attachments: [],
    sent_by: 'USOFI',
    reactions: {},
    organization_id,
  });

  const commentRes = await dbRunQuery(insertCommentQ);
  const comment = commentRes.changes[0].new_val;

  const discussionQuery = dbUpdateQuery('discussions', discussion_id, {
    topic: shorten(topic, 60),
    last_comment_at: comment.sent_at,
    last_comment: mentionsClean(comment.message).slice(0, 100),
    last_comment_by: 'USOFI',
    last_two_comments_by: r.row('last_two_comments_by').filter(a => a.ne('USOFI')).append('USOFI').do((a) => {
      return r.branch(a.count().gt(2), a.deleteAt(0), a);
    }),
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
      },
      {
        type: 'comment',
        data: comment,
      },
    ],
  };
  res.locals.messageGroupId = discussion_id;
}).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
