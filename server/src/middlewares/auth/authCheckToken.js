import { query } from 'src/utils/db/db';

export default async (req, res, next) => {
  const { user_id, token } = res.locals;

  // Check user token
  const tokenQ = await query(
    `
      UPDATE tokens 
      SET
        expires_at = now() + INTERVAL '30 days',
        last_seen_at = now()
      WHERE token=$1
      AND user_id=$2
      AND expires_at > now()
      RETURNING token
    `,
    [token, user_id]
  );

  if (tokenQ.rows.length === 0) {
    throw Error('not_authed');
  }

  return next();
};
