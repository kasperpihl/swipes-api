import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import update from 'src/utils/update';
import redisPublish from 'src/utils/redis/redisPublish';
import idGenerate from 'src/utils/idGenerate';
import queueScheduleJobBatch from 'src/utils/queue/queueScheduleJobBatch';

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

    const organizationId = idGenerate('ORG-');
    // creating a new user from scratch
    const [organizationRes, userInsertQuery, userRes] = await transaction([
      sqlInsertQuery('organizations', {
        organization_id: organizationId,
        name,
        owner_id: user_id
      }),
      sqlInsertQuery('organization_users', {
        organization_id: organizationId,
        user_id: user_id,
        admin: true,
        status: 'active'
      }),
      {
        text: `
          SELECT ou.status, ou.organization_id, ou.admin, u.first_name, u.last_name, u.email, u.user_id, u.username, u.photo
          FROM users u
          LEFT JOIN organization_users ou
          ON u.user_id = ou.user_id 
          AND ou.organization_id = $1
          WHERE u.user_id = $2
        `,
        values: [organizationId, user_id]
      }
    ]);

    await redisPublish(user_id, {
      type: 'subscribeChannel',
      payload: { channel: organizationId }
    });

    res.locals.backgroundInput = {
      organization_id: organizationId
    };

    res.locals.update = update.prepare(organizationId, [
      { type: 'organization', data: organizationRes.rows[0] },
      { type: 'organization_user', data: userRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);

  const { organization_id } = res.locals.input;

  // Trial email 1 week left
  await queueScheduleJobBatch({
    job_name: 'job.sendEmail',
    owned_by: organization_id,
    identifier: 'trial-1week',
    run_at: 60 * 24 * 7
  });

  // Trial 1 day left
  await queueScheduleJobBatch({
    job_name: 'job.sendEmail',
    owned_by: organization_id,
    identifier: 'trial-1day',
    run_at: 60 * 24 * 13
  });

  // Trial expired
  await queueScheduleJobBatch({
    job_name: 'job.sendEmail',
    owned_by: organization_id,
    identifier: 'trial-expired',
    run_at: 60 * 24 * 15,
    recurring: 60 * 24 * 3 // Re-send every 3 days
  });
});
