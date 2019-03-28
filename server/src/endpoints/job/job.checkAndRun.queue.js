import queueCreateJob from 'src/utils/queue/queueCreateJob';
import queueRunBatch from 'src/utils/queue/queueRunBatch';

import { query } from 'src/utils/db/db';

export default queueCreateJob(async (req, res, next) => {
  let length;
  do {
    const jobsRes = await query(
      `
        WITH cte AS (
          SELECT *
          FROM jobs
          WHERE next_run_at < now()
          ORDER BY next_run_at ASC
          LIMIT 10
        )
        UPDATE jobs j
        SET
          last_run_at = now(),
          next_run_at = null
        FROM cte
        WHERE j.job_id = cte.job_id
        RETURNING *
      `
    );

    if (jobsRes.rows.length) {
      console.log('scheduling', jobsRes.rows.length);
      await queueRunBatch(
        jobsRes.rows.map(
          ({ job_name, payload, unique_identifier, owned_by }) => ({
            job_name,
            payload: {
              unique_identifier,
              owned_by,
              payload: payload || null
            }
          })
        )
      );
    }
    length = jobsRes.rows.length;
  } while (length);
});
