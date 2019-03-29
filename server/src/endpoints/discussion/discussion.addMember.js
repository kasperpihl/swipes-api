import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import userTeamCheck from 'src/utils/userTeamCheck';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import { query, transaction } from 'src/utils/db/db';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require(),
  target_user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res) => {
    // Get inputs
    const { user_id } = res.locals;
    const { discussion_id, target_user_id } = res.locals.input;

    const discussionRes = await query(
      `SELECT privacy, owned_by FROM discussions WHERE discussion_id = $1`,
      [discussion_id]
    );

    const disc = discussionRes.rows[0];

    // Check that target user exists and is not owner.
    await userTeamCheck(target_user_id, disc.owned_by);

    const queries = [
      {
        text: `
          UPDATE discussions
          SET
            updated_at = now(),
            followers = followers || jsonb_build_object('${target_user_id}', ${sqlToIsoString(
          'last_comment_at'
        )})
          WHERE discussion_id = $1
          RETURNING followers, updated_at, discussion_id
        `,
        values: [discussion_id]
      }
    ];
    if (disc.privacy === 'private') {
      queries.push(
        sqlPermissionInsertQuery(discussion_id, disc.privacy, disc.owned_by, [
          target_user_id
        ])
      );
    }
    const [discussionUpdateRes] = await transaction(queries);

    res.locals.update = update.prepare(discussion_id, [
      { type: 'discussion', data: discussionUpdateRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
