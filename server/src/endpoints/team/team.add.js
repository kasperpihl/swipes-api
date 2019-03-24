import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlOnboardingDiscussionQueries from 'src/utils/sql/sqlOnboardingDiscussionQueries';
import update from 'src/utils/update';
import redisPublish from 'src/utils/redis/redisPublish';
import idGenerate from 'src/utils/idGenerate';
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

    const teamId = idGenerate('T-');
    // creating a new user from scratch
    const [teamRes, userInsertQuery, userRes] = await transaction([
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
      },
      ...sqlOnboardingDiscussionQueries(teamId, user_id)
    ]);

    await redisPublish(user_id, {
      type: 'subscribeChannel',
      payload: { channel: teamId }
    });

    res.locals.backgroundInput = {
      team_id: teamId
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

  const { team_id } = res.locals.input;

  // Trial email 1 week left
  await queueScheduleBatch({
    job_name: 'job.sendEmail.queue',
    owned_by: team_id,
    identifier: 'trial-1week',
    run_at: 60 * 24 * 7
  });

  // Trial 1 day left
  await queueScheduleBatch({
    job_name: 'job.sendEmail.queue',
    owned_by: team_id,
    identifier: 'trial-1day',
    run_at: 60 * 24 * 13
  });

  // Trial expired
  await queueScheduleBatch({
    job_name: 'job.sendEmail.queue',
    owned_by: team_id,
    identifier: 'trial-expired',
    run_at: 60 * 24 * 15,
    recurring: 60 * 24 * 3 // Re-send every 3 days
  });
});
