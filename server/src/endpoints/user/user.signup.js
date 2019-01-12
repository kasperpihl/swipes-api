import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import { transaction } from 'src/utils/db/db';
import idGenerate from 'src/utils/idGenerate';
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

    if (user) {
      throw Error('user_exists');
    } else {
      userId = idGenerate('U');
    }

    // Creating the actual token
    const token = tokenCreate({
      iss: userId
    });

    await transaction([
      sqlInsertQuery('tokens', {
        token,
        user_id: userId,
        info: {
          platform: req.header('sw-platform') || 'browser',
          ip: getClientIp(req)
        }
      }),
      sqlInsertQuery('users', {
        user_id: userId,
        email,
        password: passwordSha1
      }),
      sqlInsertQuery('user_permissions', {
        user_id: userId,
        permission_to: userId
      })
    ]);

    // Create response data.
    res.locals.output = {
      token,
      user_id: userId
    };
  }
);
