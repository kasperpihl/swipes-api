import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import db from 'src/utils/db/db';

const expectedInput = {
  user_id: string.require()
};

export default endpointCreate(
  {
    endpoint: '/user.signout',
    expectedInput
  },
  async (req, res, next) => {
    const { dbToken } = res.locals;
    const { user_id } = res.locals.input;

    // Revoke user's token
    await db('UPDATE tokens SET revoked=true WHERE user_id=$1 AND token=$2', [
      user_id,
      dbToken
    ]);

    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {});
