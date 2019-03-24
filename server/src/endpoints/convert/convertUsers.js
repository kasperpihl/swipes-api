import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

export default async function convertUsers({ team, users, c }) {
  const usersToInsert = users.map(u => ({
    user_id: u.id,
    email: u.email,
    password: u.password,
    created_at: u.created_at,
    updated_at: u.updated_at,
    first_name: u.profile.first_name || null,
    last_name: u.profile.last_name || null,
    photo: (u.profile.photos && JSON.stringify(u.profile.photos)) || null
  }));

  const userRes = await c.query(sqlInsertQuery('users', usersToInsert));

  const teamRes = await c.query(
    sqlInsertQuery('teams', {
      team_id: team.id,
      created_at: team.created_at,
      updated_at: team.updated_at,
      name: team.name,
      owner_id: team.owner_id,
      trial_ending: team.trial.ending_at,
      trial_started: team.trial.started_at,
      stripe_customer_id: team.stripe_customer_id || null,
      stripe_subscription_id: team.stripe_subscription_id || null,
      plan: team.plan || null
    })
  );

  const useteamRes = await c.query(
    sqlInsertQuery(
      'team_users',
      usersToInsert.map(user => ({
        team_id: team.id,
        user_id: user.user_id,
        admin: team.admins.indexOf(user.user_id) > -1,
        status:
          team.disabled_users.indexOf(user.user_id) > -1 ? 'disabled' : 'active'
      }))
    )
  );
  console.log('INSERTED team AND USERS');
}
