import sha1 from 'sha1';
import moment from 'moment';
import { string, number } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query, transaction } from 'src/utils/db/db';
import idGenerate from 'src/utils/idGenerate';
import getClientIp from 'src/utils/getClientIp';
import tokenCreate from 'src/utils/token/tokenCreate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlOnboardingProjectQueries from 'src/utils/sql/sqlOnboardingProjectQueries';
import queueScheduleBatch from 'src/utils/queue/queueScheduleBatch';

const expectedInput = {
  email: string.format('email').require(),
  password: string.min(1).require(),
  first_name: string.min(1).require(),
  last_name: string.min(1).require(),
  timezone_offset: number
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    const {
      password,
      first_name,
      last_name,
      timezone_offset
    } = res.locals.input;
    const passwordSha1 = sha1(password);
    let { email } = res.locals.input;
    let userId;

    // always lowercase emails or login details
    email = email.toLowerCase();

    // check if this user is available
    const checkUserQ = await query('SELECT email FROM users WHERE email=$1', [
      email
    ]);
    const user = checkUserQ.rows[0];

    if (user) {
      throw Error().toClient('User already exists');
    } else {
      userId = idGenerate('U', 8, true);
    }

    // Creating the actual token
    const token = tokenCreate('sw', {
      iss: userId,
      iat: Math.floor(Date.now() / 1000)
    });

    await transaction([
      sqlInsertQuery('users', {
        user_id: userId,
        email,
        first_name,
        last_name,
        timezone_offset,
        password: passwordSha1
      }),
      sqlInsertQuery('sessions', {
        token,
        user_id: userId,
        info: {
          platform: req.header('sw-platform') || 'browser',
          ip: getClientIp(req)
        }
      }),
      ...sqlOnboardingProjectQueries(userId, first_name)
    ]);

    const runFridayAt = moment().utc();
    runFridayAt.day(5);
    runFridayAt.minutes(0);
    runFridayAt.hours(12);

    // Random minute in hour. (spread out queue jobs);
    runFridayAt.add(Math.floor(Math.random() * 59), 'minutes');
    runFridayAt.add(timezone_offset, 'minutes');

    if (runFridayAt.isSameOrBefore(moment(), 'day')) {
      runFridayAt.add(1, 'week');
    }
    await queueScheduleBatch([
      {
        owned_by: userId,
        job_name: 'job.sendEmail.queue',
        unique_identifier: 'onboarding-1h',
        run_at: 60
      },
      {
        owned_by: userId,
        job_name: 'job.sendEmail.queue',
        unique_identifier: 'friday-reminder',
        run_at: runFridayAt.toDate(),
        recurring: 60 * 24 * 7
      }
    ]);

    // Create response data.
    res.locals.output = {
      token,
      user_id: userId
    };
  }
);
