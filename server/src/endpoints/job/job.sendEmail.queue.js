import { query } from 'src/utils/db/db';
import queueCreateJob from 'src/utils/queue/queueCreateJob';
import emailFridayReminder from 'src/utils/email/emailFridayReminder';

export default queueCreateJob(async (req, res, next) => {
  console.log('running email!', res.locals);
  const { owned_by, unique_identifier, payload } = res.locals;

  async function fetchUser(userId) {
    const userRes = await query(
      `
        SELECT email, first_name 
        FROM users
        WHERE user_id = $1
      `,
      [userId]
    );

    return userRes.rows[0];
  }

  switch (unique_identifier) {
    case 'friday-reminder': {
      const user = await fetchUser(owned_by);
      await emailFridayReminder(user.email, user.first_name);
      break;
    }
    default:
      console.log('UNKNOWN EMAIL', unique_identifier);
  }
});
