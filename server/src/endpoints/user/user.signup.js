import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import db from 'src/utils/db/dbPool';
import idGenerate from 'src/utils/idGenerate';
import getClientIp from 'src/utils/getClientIp';
import createTokens from 'src/utils/auth/createTokens';

const expectedInput = {
  email: string.format('email').require(),
  password: string.min(1).require(),
  first_name: string.max(32).require(),
  last_name: string.max(32).require()
};

export default endpointCreate(
  {
    endpoint: '/user.signup',
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    const { password, first_name, last_name } = res.locals.input;
    const profile = {
      first_name,
      last_name
    };
    const passwordSha1 = sha1(password);
    let { email } = res.locals.input;
    let userId;

    // always lowercase emails or login details
    email = email.toLowerCase();

    // check if this user is available
    const checkUserQ = await db(
      'SELECT email, activated FROM users WHERE email=$1',
      [email]
    );
    const user = checkUserQ.rows[0];

    if (user && user.activated === true) {
      throw Error('There is a user with that email');
    } else {
      userId = idGenerate('U');
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
      iss: userId
    });

    await db(
      'INSERT INTO tokens (timestamp, token, user_id, info, revoked) VALUES ($1, $2, $3, $4, $5)',
      [new Date(), tokens.token, userId, tokenInfo, false]
    );

    // creating a new user from scratch
    await db(
      `INSERT INTO users (id, email, profile, password, created_at, updated_at, activated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, email, profile, passwordSha1, new Date(), new Date(), true]
    );

    // Create response data.
    res.locals.output = {
      user_id: userId,
      token: tokens.shortToken
    };
  }
).background(async (req, res) => {});
