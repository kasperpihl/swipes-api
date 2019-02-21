import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    const { user_id, token } = res.locals;

    // Revoke user's token
    await query(
      'UPDATE sessions SET expires_at = now() WHERE user_id=$1 AND token=$2',
      [user_id, token]
    );
  }
);
