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
});
