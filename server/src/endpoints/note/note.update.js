import { string, number } from 'valjs';
import { transaction } from 'src/utils/db/db';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';

import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  note_id: string.require(),
  rev: number.require(),
  title: string,
  text: string
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    // Get inputs
    const { user_id, input } = res.locals;
    const { note_id, text, title, rev } = input;

    const values = [];
    const returning = [
      'updated_at',
      'updated_by',
      'owned_by',
      'note_id',
      'rev'
    ];

    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let queryText = `
      UPDATE notes
      SET
        updated_at = now(),
        updated_by = ${insertVariable(user_id)},
        rev = rev + 1
    `;
    if (title) {
      queryText += `, title = ${insertVariable(title)}`;
      returning.push('title');
    }
    if (text) {
      queryText += `, text = ${insertVariable(text)}`;
      returning.push('text');
    }

    queryText += `
      WHERE note_id = ${insertVariable(note_id)}
      AND ${sqlCheckPermissions('owned_by', user_id)}
      RETURNING ${returning.join(', ')}
    `;

    const [noteRes] = await transaction([
      {
        text: queryText,
        values,
        onSuccess: res => {
          if (res.rows.length && res.rows[0].rev > rev + 1) {
            throw Error('out_of_sync')
              .code(400)
              .info(
                `rev did not match current revision (${result.rows[0].rev - 1})`
              );
          }
        }
      }
    ]);

    if (!noteRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    // Create response data.
    res.locals.output = {};
  }
);
