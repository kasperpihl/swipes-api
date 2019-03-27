import { query } from 'src/utils/db/db';
import queueCreateJob from 'src/utils/queue/queueCreateJob';
import emailFridayReminder from 'src/utils/email/emailFridayReminder';

export default queueCreateJob(async (req, res, next) => {
  console.log('running email!', res.locals);
  const { user_id } = res.locals.payload;
  const userRes = await query(
    `
      SELECT email, first_name 
      FROM users
      WHERE user_id = $1
    `,
    [user_id]
  );

  const user = userRes.rows[0];

  await emailFridayReminder(user.email, user.first_name);
  console.log('executing email job!', new Date().toISOString(), res.locals);
});
