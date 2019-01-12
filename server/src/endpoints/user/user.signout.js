import endpointCreate from 'src/utils/endpointCreate';
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
      'UPDATE tokens SET expires_at = now() WHERE user_id=$1 AND token=$2',
      [user_id, token]
    );

    // Create response data.
    res.locals.output = {};
  }
);
