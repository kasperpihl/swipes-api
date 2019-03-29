import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';
import mentionsClean from 'src/utils/mentions/mentionsClean';
import pushSend from 'src/utils/push/pushSend';
import { query, transaction } from 'src/utils/db/db';

const expectedInput = {
  discussion_id: string.require(),
  comment_id: string.require(),
  reaction: string
};

export default endpointCreate(
  {
    permissionKey: 'discussion_id',
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { comment_id, reaction, discussion_id } = input;

    const [commentRes, discussionRes] = await transaction([
      {
        text: `
          UPDATE discussion_comments
          SET
            updated_at = now(),
            reactions = ${
              reaction
                ? `reactions || jsonb_build_object('${user_id}', '${reaction}')`
                : `jsonb_strip_nulls(reactions || jsonb_build_object('${user_id}', null))`
            }
            
          WHERE discussion_id = $1
          AND comment_id = $2
          RETURNING discussion_id, comment_id, updated_at, reactions, message
        `,
        values: [discussion_id, comment_id]
      },
      results => ({
        text: `
          UPDATE discussions
          SET
            updated_at = now(),
            last_comment_at = $1,
            last_comment_by = $2,
            last_comment = $3,
            members = members || jsonb_build_object('${user_id}', '${results[0].rows[0].updated_at.toISOString()}')
          WHERE discussion_id = $4
          RETURNING last_comment_at, last_comment_by, last_comment, members, discussion_id, updated_at, title
        `,
        values: [
          results[0].rows[0].updated_at,
          user_id,
          `${reaction ? 'loved' : 'unloved'} the comment: ${mentionsClean(
            results[0].rows[0].message
          ).slice(0, 60)}`,
          discussion_id
        ]
      })
    ]);

    res.locals.update = update.prepare(discussion_id, [
      {
        type: 'discussion',
        data: discussionRes.rows[0]
      },
      {
        type: 'comment',
        data: commentRes.rows[0]
      }
    ]);

    res.locals.output = {
      reaction
    };
  }
).background(async (req, res) => {
  const { user_id } = res.locals;
  const { reaction } = res.locals.output;
  const { rows } = res.locals.update;
  await update.send(res.locals.update);

  const discussion = rows[0].data;
  const comment = rows[1].data;

  // Fire push to the commenter.
  if (reaction) {
    if (comment.created_by === user_id) {
      return;
    }

    // Fetch sender (to have the name)
    const senderRes = await query(
      'SELECT first_name, user_id FROM users WHERE user_id = $1',
      [user_id]
    );
    const sender = senderRes.rows[0];

    await pushSend(
      {
        users: [comment.sent_by],
        targetId: discussion.discussion_id,
        targetType: 'discussion'
      },
      {
        content: `${sender.first_name} loved your comment: ${mentionsClean(
          comment.message
        ).slice(0, 60)}`,
        heading: discussion.title
      }
    );
  }
});
