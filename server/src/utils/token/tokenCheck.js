import { query } from 'src/utils/db/db';
import tokenParse from 'src/utils/token/tokenParse';

export default async token => {
  const parsedToken = tokenParse(token);
  const user_id = parsedToken.tokenContent.iss;

  // Check user token
  const tokenRes = await query(
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

  if (!tokenRes || !tokenRes.rows.length) {
    throw Error('not_authed');
  }

  return user_id;
};
