import queueCreateJob from 'src/utils/queue/queueCreateJob';
import queueSendJob from 'src/utils/queue/queueSendJob';

import { query } from 'src/utils/db/db';

export default queueCreateJob(async (req, res, next) => {
  console.log('running at schedule', new Date().toISOString());
  const jobsRes = await query(
    `
      UPDATE jobs
      SET
        last_execution_at = now(),
        next_execution_at = null
      WHERE next_execution_at < now()
      RETURNING *
    `
  );
  console.log('found ' + jobsRes.rows.length + ' jobs');
  for (let i = 0; i < jobsRes.rows.length; i++) {
    const job = jobsRes.rows[i];
    await queueSendJob(job.job_name, {
      identifier: job.identifier,
      payload: job.payload || null
    });
  }
});
