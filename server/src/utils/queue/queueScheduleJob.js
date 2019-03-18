import { string, number, object, any, date } from 'valjs';
import { query } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

export default async function queueScheduleJob(jobs) {
  if (!Array.isArray(jobs)) {
    jobs = [jobs];
  }

  await query(
    sqlInsertQuery(
      'jobs',
      jobs.map(j => {
        const schema = object.as({
          job: string.require(),
          identifier: string.require(),
          time: any.of(number, date).require(),
          owned_by: string.require(),
          payload: object,
          recuring: number
        });
        const error = schema.test(j);
        if (error) {
          throw Error('queueScheduleJob validationError').info({
            validationError: error,
            schema: schema.toString()
          });
        }
        let { job, identifier, payload, time, recurring, owned_by } = j;
        if (typeof time === 'number') {
          const now = new Date();
          now.setSeconds(now.getSeconds() + time);
          time = now;
        }

        return {
          next_execution_at: time.toISOString(),
          job_name: job,
          identifier,
          owned_by,
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
