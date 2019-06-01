import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

import update from 'src/utils/update';
import redisPublish from 'src/utils/redis/redisPublish';
import idGenerate from 'src/utils/idGenerate';
import emailTeamTrialStarted from 'src/utils/email/emailTeamTrialStarted';
import queueScheduleBatch from 'src/utils/queue/queueScheduleBatch';

const expectedInput = {
  name: string.min(1).require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { name } = input;

    const teamId = idGenerate('T', 8, true);

    const [teamRes, _dQ, _pQ, _uQ, userRes] = await transaction([
      sqlInsertQuery('teams', {
        team_id: teamId,
        name,
        owner_id: user_id
      }),
      sqlInsertQuery('team_users', {
        team_id: teamId,
        user_id: user_id,
        admin: true,
        status: 'active'
      }),
      {
        text: `
        SELECT tu.status, tu.team_id, tu.admin, u.first_name, u.last_name, u.email, u.user_id, u.username, u.photo
        FROM users u
        LEFT JOIN team_users tu
        ON u.user_id = tu.user_id 
        AND tu.team_id = $1
        WHERE u.user_id = $2
        `,
        values: [teamId, user_id]
      }
    ]);

    await redisPublish(user_id, {
      type: 'subscribeChannel',
      payload: { channel: teamId }
    });

    res.locals.backgroundInput = {
      team_id: teamId,
      team_name: name
    };

    res.locals.output = {
      team_id: teamId
    };

    res.locals.update = update.prepare(teamId, [
      { type: 'team', data: teamRes.rows[0] },
      { type: 'team_user', data: userRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  const { user_id } = res.locals;
  const { team_id, team_name } = res.locals.input;
  console.log(team_id, team_name, user_id);
  const userRes = await query(
    `
      SELECT first_name, email
      FROM users
      WHERE user_id = $1
    `,
    [user_id]
  );

  const user = userRes.rows[0];
  await emailTeamTrialStarted(user.email, user.first_name, team_name, team_id);
  // Trial email 1 week left
  await queueScheduleBatch({
    job_name: 'job.sendEmail.queue',
    owned_by: team_id,
    unique_identifier: 'trial-1week',
    run_at: 60 * 24 * 24
  });

  // Trial 1 day left
  await queueScheduleBatch({
    job_name: 'job.sendEmail.queue',
    owned_by: team_id,
    unique_identifier: 'trial-1day',
    run_at: 60 * 24 * 30
  });

  // Trial expired
  await queueScheduleBatch({
    job_name: 'job.sendEmail.queue',
    owned_by: team_id,
    unique_identifier: 'trial-expired',
    run_at: 60 * 24 * 31
  });
});
