import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import redisPublish from 'src/utils/redis/redisPublish';
import update from 'src/utils/update';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import tokenParse from 'src/utils/token/tokenParse';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import stripeUpdateQuantity from 'src/utils/stripe/stripeUpdateQuantity';

const expectedInput = {
  invitation_token: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { invitation_token } = input;
    const parsedToken = tokenParse('sw-i', invitation_token);

    if (!parsedToken || !parsedToken.tokenContent) {
      throw Error('Invalid token').toClient();
    }

    const { sub: team_id, aud: email, exp } = parsedToken.tokenContent;

    const teamRes = await query(
      `
        SELECT t.team_id, t.pending_users, tu.status
        FROM teams t
        LEFT JOIN team_users tu
        ON tu.user_id = $2
        AND tu.team_id = t.team_id
        WHERE t.team_id = $1
      `,
      [team_id, user_id]
    );
    const team = teamRes.rows[0];

    const now = Math.floor(Date.now() / 1000);
    if (!team.pending_users[email] || exp < now || team.status === 'active') {
      throw Error('Invalid token')
        .info(team)
        .toClient();
    }

    const [teamUserRes, teamInsertRes] = await transaction([
      sqlInsertQuery(
        'team_users',
        {
          user_id,
          team_id,
          status: 'active'
        },
        {
          upsert: 'team_users_pkey'
        }
      ),
      {
        text: `
          UPDATE teams
          SET 
            pending_users = jsonb_strip_nulls(
              pending_users || jsonb_build_object('${email}', null)
            )
          WHERE team_id = $1
          RETURNING team_id, pending_users
        `,
        values: [team_id]
      },
      {
        text: `
          UPDATE discussions
          SET members = members || jsonb_build_object('${user_id}', ${sqlToIsoString(
          'now()'
        )})
          WHERE owned_by = $1
          AND is_default = true
        `,
        values: [team_id]
      }
    ]);

    await redisPublish(user_id, { type: 'forceDisconnect' });

    res.locals.backgroundInput = {
      team_id
    };

    res.locals.update = update.prepare(team_id, [
      { type: 'team', data: teamInsertRes.rows[0] },
      { type: 'team_user', data: teamUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  const { team_id } = res.locals.input;
  await stripeUpdateQuantity(team_id);
});
