import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
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
            followers = followers || jsonb_build_object('${user_id}', '${results[0].rows[0].updated_at.toISOString()}')
          WHERE discussion_id = $4
          RETURNING last_comment_at, last_comment_by, last_comment, followers, discussion_id, updated_at
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

    // Create response data.
    res.locals.output = {
      updates: [
        {
          type: 'discussion',
          data: discussionRes.rows[0]
        },
        {
          type: 'comment',
          data: commentRes.rows[0]
        }
      ],
      reaction
    };
  }
).background(async (req, res) => {
  dbSendUpdates(res.locals);
  const { user_id } = res.locals;
  const { updates, reaction } = res.locals.output;

  // Fire push to all the commenter.
  if (reaction) {
    const discussion = updates[0].data;
    const comment = updates[1].data;
    if (comment.created_by === user_id) {
      return;
    }

    // Fetch sender (to have the name)
    const senderRes = await query(
      'SELECT profile, user_id FROM users WHERE user_id = $1',
      [user_id]
    );
    const sender = renderRes.rows[0];

    await pushSend(
      {
        users: [comment.sent_by],
        targetId: discussion.discussion_id,
        targetType: 'discussion'
      },
      {
        content: `${
          sender.profile.first_name
        } loved your comment: ${mentionsClean(comment.message).slice(0, 60)}`,
        heading: discussion.topic
      }
    );
  }
});
