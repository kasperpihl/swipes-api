import db from 'src/utils/db/db';

export default async (req, res, next) => {
  const { user_id, dbToken } = res.locals;

  // Check user token
  const token = await db(
    'SELECT token FROM tokens WHERE user_id=$1 AND token=$2 AND revoked=$3',
    [user_id, dbToken, false]
  );

  if (token.rows.length === 0) {
    throw Error('not_authed');
  }

  return next();
};
