import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';
import { query } from 'src/utils/db/db';

const expectedInput = {
  first_name: string.min(1),
  last_name: string.min(1)
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { first_name, last_name } = input;
    if (!first_name && !last_name) {
      throw Error('no_data').toClient();
    }
    // Prepare for dynamic support of adding values
    const values = [];
    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let text = `
      UPDATE users
      SET updated_at = now()
    `;
    let returning = ['user_id'];

    if (first_name) {
      text += `, first_name = ${insertVariable(first_name)}`;
      returning.push('first_name');
    }
    if (last_name) {
      text += `, last_name = ${insertVariable(last_name)}`;
      returning.push('last_name');
    }

    text += `
      WHERE user_id=${insertVariable(user_id)}
      RETURNING ${returning.join(', ')}`;

    const userRes = await query(text, values);

    const teamRes = await query(
      `
        SELECT team_id
        FROM team_users
        WHERE user_id = $1
        AND status = 'active'
      `,
      [user_id]
    );

    const channels = [user_id, ...teamRes.rows.map(r => r.team_id)];

    res.locals.update = update.prepare(channels, [
      { type: 'me', data: userRes.rows[0] }
    ]);
  }
);
