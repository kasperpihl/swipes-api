import r from 'rethinkdb';
import { object, array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import dbSendUpdates from 'src/utils/db/dbSendUpdates';
import dbRunQuery from 'src/utils/db/dbRunQuery';
import mentionsGetArray from 'src/utils/mentions/mentionsGetArray';
import mentionsClean from 'src/utils/mentions/mentionsClean';
import pushSend from 'src/utils/push/pushSend';

const expectedInput = {
  message: string.require(),
  topic: string.min(1).require(),
  attachments: array.of(object),
  privacy: any.of('public', 'private'),
  followers: array.of(string),
  organization_id: string.min(1)
};

export default endpointCreate(
  {
    endpoint: '/discussion.add',
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const {
      message,
      attachments,
      topic,
      organization_id,
      followers = []
    } = res.locals.input;
    console.log('hello');
    const uniqueFollowers = [
      ...new Set(followers.concat(mentionsGetArray(message))).add(user_id)
    ];
    const discussionId = idGenerate('D', 15);
    const ownedBy = organization_id || user_id;

    const [discussionRes, discussionFollowersRes] = await transaction([
      sqlInsertQuery('discussions', {
        discussion_id: discussionId,
        owned_by: ownedBy,
        topic,
        created_by: user_id,
        last_comment_by: user_id,
        last_comment: mentionsClean(message).slice(0, 100),
        last_comment_at: 'now()'
      }),
      sqlInsertQuery(
        'discussion_followers',
        uniqueFollowers.map(userId => ({
          owned_by: ownedBy,
          user_id: userId,
          discussion_id: discussionId,
          read_at: userId === user_id ? 'now()' : null
        }))
      ),
      sqlInsertQuery('discussion_comments', {})
    ]);

    res.locals.output = {
      rows: discussionRes.rows.concat(discussionFollowersRes.rows)
    };
    return;
    // // Inserting the comment object.
    // const commentQuery = dbInsertQuery('comments', {
    //   id: `${discussionId}-${idGenerate('C', 7)}`,
    //   message,
    //   discussion_id: discussionId,
    //   sent_at: created_at,
    //   attachments: attachments || [],
    //   reactions: {},
    //   sent_by: user_id,
    //   organization_id
    // });

    // const [discussionRes, followersRes, commentRes] = await Promise.all([
    //   dbRunQuery(discussionQuery),
    //   dbRunQuery(discussionFollowersQuery),
    //   dbRunQuery(commentQuery)
    // ]);

    // const discussion = discussionRes.changes[0].new_val;

    // discussion.followers = followersRes.changes.map(o => o.new_val);

    // // Create response data.
    // res.locals.output = {
    //   updates: [
    //     { type: 'discussion', data: discussion },
    //     { type: 'comment', data: commentRes.changes[0].new_val }
    //   ]
    // };
    // res.locals.messageGroupId = discussion.id;
  }
).background(async (req, res) => {
  return;
  dbSendUpdates(res.locals);

  const { organization_id, user_id } = res.locals;
  const { updates } = res.locals.output;

  const discussion = updates[0].data;
  const comment = updates[1].data;
  // Fetch sender (to have the name)
  const sender = await dbRunQuery(
    r
      .table('users')
      .get(user_id)
      .pluck('profile')
  );

  // Fire push to all the receivers.
  const receivers = discussion.followers
    .map(f => f.user_id)
    .filter(f => f !== user_id);
  if (receivers.length) {
    await pushSend(
      {
        orgId: organization_id,
        users: receivers,
        targetId: discussion.id,
        targetType: 'discussion'
      },
      {
        content: mentionsClean(comment.message),
        heading: `${sender.profile.first_name} started a discussion`
      }
    );
  }
});
