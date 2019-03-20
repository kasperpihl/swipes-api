import { string, object } from 'valjs';
import { transaction } from 'src/utils/db/db';

export default async function queueCancelBatch(jobs) {
  if (!Array.isArray(jobs)) {
    jobs = [jobs];
  }

  await transaction(
    jobs.map(j => {
      const schema = object.as({
        owned_by: string.require(),
        job_name: string,
        identifier: string
      });
      const error = schema.test(j);
      if (error) {
        throw Error('queueCancelBatch validationError').info({
          validationError: error,
          schema: schema.toString()
        });
      }

      const { job_name, identifier, owned_by } = j;
      const values = [owned_by];
      let text = `
        DELETE FROM jobs
        WHERE owned_by = $1
      `;
      if (job_name) {
        text += `
          AND job_name = $${values.push(job_name)}
        `;
      }
      if (identifier) {
        text += `
          AND identifier = ${values.push(identifier)}
        `;
      }

      return {
        text,
        values
      };
    })
  );
}
