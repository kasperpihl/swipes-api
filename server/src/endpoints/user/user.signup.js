import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';
import idGenerate from 'src/utils/idGenerate';
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
    const passwordSha1 = sha1(password);
    let { email } = res.locals.input;
    let userId;

    // always lowercase emails or login details
    email = email.toLowerCase();

    // check if this user is available
    const checkUserQ = await query(
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

    // Creating the actual token
    const token = createToken({
      iss: userId
    });

    await query(
      'INSERT INTO tokens (timestamp, token, user_id, info, revoked) VALUES ($1, $2, $3, $4, $5)',
      [new Date(), token, userId, tokenInfo, false]
    );

    // creating a new user from scratch
    await query(
      `INSERT INTO users (user_id, email, password, created_at, updated_at, activated) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email, passwordSha1, new Date(), new Date(), true]
    );

    // Create response data.
    res.locals.output = {
      token,
      user_id: userId
    };
  }
);
