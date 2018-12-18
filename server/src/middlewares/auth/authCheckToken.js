import { query } from 'src/utils/db/db';

export default async (req, res, next) => {
  const { user_id, token } = res.locals;

  // Check user token
  const tokenQ = await query(
    'SELECT token FROM tokens WHERE user_id=$1 AND token=$2 AND revoked=$3',
    [user_id, token, false]
  );

  if (tokenQ.rows.length === 0) {
    throw Error('not_authed');
  }

  return next();
};
