import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import db from 'src/utils/db/dbPool';
import getClientIp from 'src/utils/getClientIp';
import createTokens from 'src/utils/auth/createTokens';

const expectedInput = {
  email: string.format('email').require(),
  password: string.min(1).require()
};

export default endpointCreate(
  {
    endpoint: '/user.signin',
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    const { password } = res.locals.input;
    let { email } = res.locals.input;

    // always lowercase emails or login details
    email = email.toLowerCase();

    // check if this user is available
    const getUserQ = await db('SELECT id, password FROM users WHERE email=$1', [
      email
    ]);
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
    const tokens = createTokens({
      iss: user.id
    });

    await db(
      'INSERT INTO tokens (timestamp, token, user_id, info, revoked) VALUES ($1, $2, $3, $4, $5)',
      [new Date(), tokens.token, user.id, tokenInfo, false]
    );

    // Create response data.
    res.locals.output = {
      token: tokens.shortToken
    };
  }
).background(async (req, res) => {});
