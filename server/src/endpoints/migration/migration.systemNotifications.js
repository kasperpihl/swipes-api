import { query, transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import channelCreate from 'src/utils/channel/channelCreate';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

export default endpointCreate({ type: 'notAuthed' }, async () => {
  const teamUsersRes = await query(`
    SELECT tu.team_id, u.user_id
    FROM team_users tu
    LEFT JOIN users u
    ON tu.user_id = u.user_id
    WHERE notifications_channel_id IS NULL
  `);

  const queries = [];
  teamUsersRes.rows.forEach(({ team_id, user_id }) => {
    const channel = channelCreate(
      team_id,
      'private',
      'Notifications',
      user_id,
      [user_id]
    );
    channel.is_system = true;
    queries.push(
      sqlInsertQuery('discussions', channel, {
        dontPrepare: { members: true }
      })
    );
    queries.push(
      sqlPermissionInsertQuery(channel.discussion_id, 'private', team_id, [
        user_id
      ])
    );
    queries.push({
      text: `
        UPDATE team_users
        SET notifications_channel_id = $1
        WHERE team_id = $2
        AND user_id = $3
      `,
      values: [channel.discussion_id, team_id, user_id]
    });
  });

  await transaction(queries);
});
