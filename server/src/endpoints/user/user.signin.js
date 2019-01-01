import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';
import getClientIp from 'src/utils/getClientIp';
import createToken from 'src/utils/auth/createToken';

const expectedInput = {
  email: string.format('email').require(),
  password: string.min(1).require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    const { password } = res.locals.input;
    let { email } = res.locals.input;

    // always lowercase emails or login details
    email = email.toLowerCase();

    // check if this user is available
    const getUserQ = await query(
      'SELECT user_id, password FROM users WHERE email=$1',
      [email]
    );
    const user = getUserQ.rows[0];

    // Validate password
    const sha1Password = sha1(password);

    if (!user || sha1Password !== user.password) {
      throw Error('Wrong email or password');
    }

    // Take information for the token
    const platform = req.header('sw-platform') || 'browser';
    const ip = getClientIp(req);
    const tokenInfo = {
      platform,
      ip
    };

    // Creating the actual tokens
    const token = createToken({
      iss: user.user_id
    });

    await query(
      'INSERT INTO tokens (timestamp, token, user_id, info, revoked) VALUES ($1, $2, $3, $4, $5)',
      [new Date(), token, user.user_id, tokenInfo, false]
    );

    // Create response data.
    res.locals.output = {
      token
    };
  }
);
