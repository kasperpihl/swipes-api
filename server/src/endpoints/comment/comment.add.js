import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbSendNotifications from 'src/utils/db/dbSendNotifications';
import mentionsGetArray from 'src/utils/mentions/mentionsGetArray';
import mentionsClean from 'src/utils/mentions/mentionsClean';
import pushSend from 'src/utils/push/pushSend';

const expectedInput = {
  discussion_id: string.require(),
  message: string.require(),
  attachments: array.of(object)
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { discussion_id, message, attachments, organization_id } = input;
    // Inserting the comment object.
    const [commentRes, discussionRes] = await transaction([
      sqlInsertQuery('discussion_comments', {
        discussion_id,
        message,
        comment_id: idGenerate('C', 7),
        sent_at: 'now()',
        attachments: attachments || [],
        sent_by: user_id,
        reactions: {}
      }),
      results => ({
        text: `
          UPDATE discussions
          SET
            last_comment_at = $1,
            last_comment_by = $2,
            last_comment = $3,
            followers = followers || jsonb_build_object('${user_id}', '${results[0].rows[0].sent_at.toISOString()}')
          WHERE discussion_id = $4
          RETURNING discussion_id, last_comment, last_comment_at, last_comment_by, followers
        `,
        values: [
          results[0].rows[0].sent_at,
          user_id,
          mentionsClean(message).slice(0, 100),
          discussion_id
        ]
      })
    ]);

    // Create response data.
    res.locals.output = {
      updates: [
        { type: 'discussion', data: discussionRes.rows[0] },
        { type: 'comment', data: commentRes.rows[0] }
      ]
    };
  }
).background(async (req, res) => {
  dbSendUpdates(res.locals);
  const { user_id } = res.locals;
  const { updates } = res.locals.output;

  const discussion = updates[0].data;
  const comment = updates[1].data;

  // Fetch sender (to have the name)
  const senderRes = await query(
    'SELECT profile, user_id FROM users WHERE user_id = $1',
    [user_id]
  );
  const sender = senderRes.rows[0];

  const mentions = mentionsGetArray(comment.message);
  await dbSendNotifications(
    mentions.map(m => ({
      id: `${m}-${comment.id}-mention`,
      user_id: m,
      organization_id,
      title: `<!${sender.id}> mentioned you in a comment: ${mentionsClean(
        comment.message
      ).slice(0, 60)}...`,
      done_by: [user_id],
      target: {
        id: comment.discussion_id,
        item_id: comment.comment_id
      }
    }))
  );

  const followers = [
    ...new Set(Object.keys(discussion.followers).concat(mentions))
  ];

  // Fire push to all the receivers.
  const receivers = followers.filter(f => f !== user_id);
  if (receivers.length) {
    await pushSend(
      {
        users: receivers,
        targetId: discussion.discussion_id,
        targetType: 'discussion'
      },
      {
        content: `${sender.profile.first_name}: ${mentionsClean(
          comment.message
        )}`,
        heading: discussion.topic
      }
    );
  }
});
