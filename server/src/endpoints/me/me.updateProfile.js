import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
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
    let returning = ['updated_at', 'user_id'];

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

    await query(text, values);

    // Create response data.
    res.locals.output = {};
  }
);
