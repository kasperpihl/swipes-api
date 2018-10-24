import endpointCreate from 'src/utils/endpointCreate';
import db from 'src/utils/db/db';

const expectedInput = {};

export default endpointCreate(
  {
    endpoint: '/user.signout',
    expectedInput
  },
  async (req, res, next) => {
    const { user_id, token } = res.locals;

    // Revoke user's token
    await db('UPDATE tokens SET revoked=true WHERE user_id=$1 AND token=$2', [
      user_id,
      token
    ]);

    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {});
