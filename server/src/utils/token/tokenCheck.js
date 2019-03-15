import { query } from 'src/utils/db/db';

export default async token => {
  // Check user token
  const tokenRes = await query(
    `
      UPDATE sessions 
      SET
        expires_at = now() + INTERVAL '30 days',
        last_seen_at = now()
      WHERE token=$1
      AND expires_at > now()
      RETURNING user_id
    `,
    [token]
  );

  if (!tokenRes || !tokenRes.rows.length) {
    throw Error('not_authed').toClient();
  }

  return tokenRes.rows[0].user_id;
};
