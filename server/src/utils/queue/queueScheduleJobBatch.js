import { string, number, object, any, date } from 'valjs';
import { query } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

export default async function queueScheduleJobBatch(jobs) {
  if (!Array.isArray(jobs)) {
    jobs = [jobs];
  }

  await query(
    sqlInsertQuery(
      'jobs',
      jobs.map(j => {
        const schema = object.as({
          job_name: string.require(),
          identifier: string.require(),
          time: any.of(number, date).require(),
          owned_by: string.require(),
          payload: object,
          recuring: number
        });
        const error = schema.test(j);
        if (error) {
          throw Error('queueScheduleJobBatch validationError').info({
            validationError: error,
            schema: schema.toString()
          });
        }
        let { job_name, identifier, payload, time, recurring, owned_by } = j;
        if (typeof time === 'number') {
          const now = new Date();
          now.setSeconds(now.getSeconds() + time);
          time = now;
        }

        return {
          owned_by,
          job_name,
          identifier,
          next_execution_at: time.toISOString(),
          payload: payload || null,
          recurring: recurring || 0
        };
      }),
      {
        upsert: 'jobs_pkey'
      }
    )
  );
}
