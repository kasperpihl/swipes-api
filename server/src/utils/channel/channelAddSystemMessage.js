import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import { transaction, query } from 'src/utils/db/db';
import mentionsClean from 'src/utils/mentions/mentionsClean';
import update from 'src/utils/update';

export default async function channelAddSystemMessage(
  teamId,
  userId,
  message,
  attachments
) {
  const teamUserRes = await query(
    `
      SELECT notifications_channel_id
      FROM team_users
      WHERE team_id = $1
      AND user_id = $2
      AND status = 'active'
    `,
    [teamId, userId]
  );

  if (!teamUserRes.rows.length) {
    throw Error('Not found')
      .code(404)
      .toClient();
  }

  const discussionId = teamUserRes.rows[0].notifications_channel_id;

  const [commentRes, discussionRes] = await transaction([
    sqlInsertQuery('discussion_comments', {
      discussion_id: discussionId,
      message: message.trim(),
      comment_id: idGenerate(6),
      sent_at: 'now()',
      attachments:
        (attachments && attachments.length && JSON.stringify(attachments)) ||
        null,
      sent_by: 'USYSTEM',
      reactions: {}
    }),
    results => ({
      text: `
        UPDATE discussions
        SET
          last_comment_at = $1,
          last_comment_by = $2,
          last_comment = $3
        WHERE discussion_id = $4
        RETURNING discussion_id, last_comment, last_comment_at, last_comment_by, members, title, owned_by
      `,
      values: [
        results[0].rows[0].sent_at,
        'USYSTEM',
        mentionsClean(message).slice(0, 100),
        discussionId
      ]
    })
  ]);

  await update.send(
    update.prepare(discussionId, [
      { type: 'discussion', data: discussionRes.rows[0] },
      { type: 'comment', data: commentRes.rows[0] }
    ])
  );
}
