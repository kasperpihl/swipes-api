import { object, array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import { transaction, query } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import update from 'src/utils/update';
import mentionsGetArray from 'src/utils/mentions/mentionsGetArray';
import mentionsClean from 'src/utils/mentions/mentionsClean';
import pushSend from 'src/utils/push/pushSend';

const expectedInput = {
  discussion_id: string.require(),
  message: string.require(),
  attachments: array.of(
    object
      .as({
        type: any.of('file', 'note', 'url'),
        id: string.require(),
        title: string.require(),
        meta: object
      })
      .require()
  )
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { input, user_id } = res.locals;
    const { discussion_id, message, attachments } = input;
    // Inserting the comment object.
    const [commentRes, discussionRes] = await transaction([
      sqlInsertQuery('discussion_comments', {
        discussion_id,
        message,
        comment_id: idGenerate('MES-', 5),
        sent_at: 'now()',
        attachments:
          (attachments && attachments.length && JSON.stringify(attachments)) ||
          null,
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
          RETURNING discussion_id, last_comment, last_comment_at, last_comment_by, followers, topic
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
    res.locals.update = update.prepare(discussion_id, [
      { type: 'discussion', data: discussionRes.rows[0] },
      { type: 'comment', data: commentRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  const { user_id } = res.locals;
  const { rows } = res.locals.update;

  await update.send(res.locals.update);

  const discussion = rows[0].data;
  const comment = rows[1].data;

  // Fetch sender (to have the name)
  const senderRes = await query(
    'SELECT first_name, user_id FROM users WHERE user_id = $1',
    [user_id]
  );
  const sender = senderRes.rows[0];

  const mentions = mentionsGetArray(comment.message);

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
        content: `${sender.first_name}: ${mentionsClean(comment.message)}`,
        heading: discussion.topic
      }
    );
  }
});
