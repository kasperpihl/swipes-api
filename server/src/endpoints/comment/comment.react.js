import r from 'rethinkdb';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbUpdateQuery from 'src/utils/db/dbUpdateQuery';
import dbInsertQuery from 'src/utils/db/dbInsertQuery';
import mentionsClean from 'src/utils/mentions/mentionsClean';

const expectedInput = {
  comment_id: string.require(),
  reaction: string,
};

export default endpointCreate(
  {
    endpoint: '/comment.react',
    expectedInput,
  },
  async (req, res) => {
    // Get inputs
    const { user_id, organization_id } = res.locals;
    const { comment_id, reaction } = res.locals.input;

    const q = dbUpdateQuery('comments', comment_id, {
      reactions: {
        [user_id]: reaction || r.literal(),
      },
    });

    const commentRes = await dbRunQuery(q);
    const comment = commentRes.changes[0].new_val;

    let updates = [
      {
        type: 'comment',
        data: comment,
      },
    ];

    if (reaction) {
      // Show like in the recent history.

      const updateDiscussionQ = dbUpdateQuery(
        'discussions',
        comment.discussion_id,
        {
          last_comment_at: comment.updated_at,
          last_comment: `loved the comment: ${mentionsClean(comment.message).slice(0, 60)}`,
          last_comment_by: user_id,
          last_two_comments_by: r.row('last_two_comments_by').filter(a => a.ne(user_id)).append(user_id).do((a) => {
            return r.branch(a.count().gt(2), a.deleteAt(0), a);
          }),
        },
      );
      // Updating read_at to be newest comment.
      // Also ensuring that user follows discussion
      const updateFollowerQ = dbInsertQuery(
        'discussion_followers',
        {
          user_id,
          id: `${comment.discussion_id}-${user_id}`,
          discussion_id: comment.discussion_id,
          read_at: comment.updated_at,
          organization_id,
        },
        {
          conflict: 'update',
        },
      );
      const result = await Promise.all([
        dbRunQuery(updateFollowerQ),
        dbRunQuery(updateDiscussionQ),
      ]);
      const discussion = result[1].changes[0].new_val;

      // Fetch the latest followers to ensure they're up to date.
      const followersQ = r
        .table('discussion_followers')
        .getAll(discussion.id, { index: 'discussion_id' })
        .pluck('user_id', 'read_at');

      discussion.followers = await dbRunQuery(followersQ);
      updates = [
        {
          type: 'discussion',
          data: discussion,
        },
      ].concat(updates);
    }

    // Create response data.
    res.locals.output = {
      updates,
    };
    res.locals.messageGroupId = comment_id;
  },
).background(async (req, res) => {
  dbSendUpdates(res.locals);
});
