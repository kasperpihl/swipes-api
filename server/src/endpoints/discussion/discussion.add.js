import { array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import update from 'src/utils/update';

const expectedInput = {
  title: string.min(1).require(),
  owned_by: string.require(),
  privacy: any.of('public', 'private'),
  followers: array.of(string)
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const {
      title,
      followers = [],
      owned_by,
      privacy = 'public'
    } = res.locals.input;
    const discussionId = idGenerate('C', 8, true);

    const uniqueFollowers = [...new Set(followers).add(user_id)];

    const followerString = `jsonb_build_object(
      ${uniqueFollowers
        .map(
          uId =>
            `'${uId}', ${uId === user_id ? sqlToIsoString('now()') : "'n'"}`
        )
        .join(', ')}
    )`;

    const [discussionRes] = await transaction([
      sqlInsertQuery(
        'discussions',
        {
          discussion_id: discussionId,
          owned_by,
          title,
          created_by: user_id,
          last_comment_by: user_id,
          last_comment: 'just created this discussion.',
          last_comment_at: 'now()',
          followers: followerString
        },
        {
          dontPrepare: { followers: true }
        }
      ),
      sqlPermissionInsertQuery(discussionId, privacy, owned_by, uniqueFollowers)
    ]);

    res.locals.update = update.prepare(discussionId, [
      { type: 'discussion', data: discussionRes.rows[0] }
    ]);

    res.locals.output = {
      discussion_id: discussionId
    };
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
