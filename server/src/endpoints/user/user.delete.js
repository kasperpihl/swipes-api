import sha1 from 'sha1';
import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import update from 'src/utils/update';

const expectedInput = {
  password: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { password } = input;

    // check if this user is available
    const userRes = await query('SELECT password FROM users WHERE user_id=$1', [
      user_id
    ]);
    const user = userRes.rows[0];

    // Validate password
    const sha1Password = sha1(password);

    if (!user || sha1Password !== user.password) {
      throw Error('Wrong password').toClient();
    }

    const ownedTeamsRes = await query(
      `
        SELECT team_id
        FROM teams
        WHERE owner_id = $1
      `,
      [user_id]
    );

    if (ownedTeamsRes.rows.length) {
      throw Error('Undeleted teams').toClient();
    }

    const numberOfTeams = await query(
      `
        SELECT team_id
        FROM team_users
        WHERE user_id = $1
      `,
      [user_id]
    );

    const deleteUserQuery = {
      text: `
        DELETE FROM users
        WHERE user_id = $1
      `,
      values: [user_id]
    };
    if (numberOfTeams.rows.length) {
      deleteUserQuery.text = `
        UPDATE users
        SET 
          deleted = true,
          password = '',
          photo = NULL,
          username = NULL
        WHERE user_id = $1
      `;
    }

    // creating a new user from scratch
    const [teamUserRes] = await transaction([
      {
        text: `
          UPDATE team_users
          SET
            status = 'disabled',
            admin = false
          WHERE user_id = $1
          RETURNING user_id, team_id, admin, status
        `,
        values: [user_id]
      },
      deleteUserQuery,
      {
        text: `
          DELETE FROM projects
          WHERE owned_by = $1
        `,
        values: [user_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE owned_by = $1
        `,
        values: [user_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE granted_to = $1
        `,
        values: [user_id]
      },
      {
        text: `
          DELETE FROM jobs
          WHERE owned_by = $1
        `,
        values: [user_id]
      },
      {
        text: `
          DELETE FROM notes
          WHERE owned_by = $1
        `,
        values: [user_id]
      },
      {
        text: `
          DELETE FROM files
          WHERE owned_by = $1
        `,
        values: [user_id]
      },
      {
        text: `
          DELETE FROM sessions
          WHERE user_id = $1
        `,
        values: [user_id]
      }
    ]);

    res.locals.update = teamUserRes.rows
      .map(data =>
        update.prepare(data.team_id, [
          {
            type: 'team_user',
            data
          }
        ])
      )
      .concat([
        update.prepare(user_id, [
          { type: 'me', data: { user_id, deleted: true } }
        ])
      ]);
  }
).background(async (req, res) => {
  for (let i = 0; i < res.locals.update.length; i++) {
    await update.send(res.locals.update[i]);
  }
});
