import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

export default async function convertUsers({ org, users, c }) {
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

  const orgRes = await c.query(
    sqlInsertQuery('organizations', {
      organization_id: org.id,
      created_at: org.created_at,
      updated_at: org.updated_at,
      name: org.name,
      owner_id: org.owner_id,
      trial_ending: org.trial.ending_at,
      trial_started: org.trial.started_at,
      stripe_customer_id: org.stripe_customer_id || null,
      stripe_subscription_id: org.stripe_subscription_id || null,
      plan: org.plan || null
    })
  );

  const useorgRes = await c.query(
    sqlInsertQuery(
      'organization_users',
      usersToInsert.map(user => ({
        organization_id: org.id,
        user_id: user.user_id,
        admin: org.admins.indexOf(user.user_id) > -1,
        status:
          org.disabled_users.indexOf(user.user_id) > -1 ? 'disabled' : 'active'
      }))
    )
  );
  console.log('INSERTED ORG AND USERS');
}
