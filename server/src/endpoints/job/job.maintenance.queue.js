import queueCreateJob from 'src/utils/queue/queueCreateJob';

import { query } from 'src/utils/db/db';

export default queueCreateJob(async () => {
  // Delete expired tokens
  await query(
    `
      DELETE FROM sessions
      WHERE expires_at < now()
    `
  );
  // Wipe out jobs that has already run
  await query(
    `
      DELETE FROM jobs
      WHERE next_run_at IS NULL
    `
  );
});
