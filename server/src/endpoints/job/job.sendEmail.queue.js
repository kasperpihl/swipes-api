import { query } from 'src/utils/db/db';
import queueCreateJob from 'src/utils/queue/queueCreateJob';
import emailFridayReminder from 'src/utils/email/emailFridayReminder';

export default queueCreateJob(async (req, res, next) => {
  console.log('running email!', res.locals);
  const { owned_by, unique_identifier, payload } = res.locals;

  if (unique_identifier.startsWith('trial-')) {
    const team = await fetchTeam(owned_by);
    const admins = await fetchAdmins(owned_by);
    for (let i = 0; i < admins.length; i++) {
      // await emailTrialReminder();
    }
  }

  if (unique_identifier === 'friday-reminder') {
    const user = await fetchUser(owned_by);
    await emailFridayReminder(user.email, user.first_name);
  } else {
    console.log('UNKNOWN EMAIL', unique_identifier);
  }

  async function fetchUser(userId) {
    const userRes = await query(
      `
        SELECT first_name, last_name, email
        FROM users
        WHERE user_id = $1
      `,
      [userId]
    );

    return userRes.rows[0];
  }
  async function fetchTeam(teamId) {
    const teamRes = await query(
      `
        SELECT name
        FROM teams
        WHERE team_id = $1
      `,
      [teamId]
    );
    return teamRes.rows[0];
  }
  async function fetchAdmins(teamId) {
    const teamRes = await query(
      `
        SELECT first_name, last_name, email
        FROM team_users tu
        INNER JOIN users u
        ON u.user_id = tu.user_id
        WHERE team_id = $1
        AND admin = true
      `,
      [teamId]
    );
    return teamRes.rows;
  }
});
