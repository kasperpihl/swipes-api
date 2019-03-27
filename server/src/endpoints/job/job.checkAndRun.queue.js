import queueCreateJob from 'src/utils/queue/queueCreateJob';
import queueRunBatch from 'src/utils/queue/queueRunBatch';

import { query } from 'src/utils/db/db';

export default queueCreateJob(async (req, res, next) => {
  console.log('running at schedule', new Date().toISOString());
  const jobsRes = await query(
    `
      UPDATE jobs
      SET
        last_run_at = now(),
        next_run_at = null
      WHERE next_run_at < now()
      RETURNING *
    `
  );

  if (!jobsRes.rows) {
    return;
  }

  await queueRunBatch(
    jobsRes.rows.map(({ job_name, payload, identifier }) => ({
      job_name,
      payload: {
        identifier: identifier,
        payload: payload || null
      }
    }))
  );
});
