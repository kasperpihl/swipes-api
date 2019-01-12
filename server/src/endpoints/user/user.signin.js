import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import getClientIp from 'src/utils/getClientIp';
import tokenCreate from 'src/utils/token/tokenCreate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

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

    await query(
      sqlInsertQuery('tokens', {
        token: tokenCreate({
          iss: user.user_id
        }),
        info: {
          platform: req.header('sw-platform') || 'browser',
          ip: getClientIp(req)
        },
        user_id: user.user_id
      })
    );

    // Create response data.
    res.locals.output = {
      token
    };
  }
);
