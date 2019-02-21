import { string, number } from 'valjs';
import { transaction } from 'src/utils/db/db';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import update from 'src/utils/update';
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
    }
    if (text) {
      queryText += `, text = ${insertVariable(text)}`;
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
            throw Error('Out of sync')
              .code(400)
              .info(
                `rev did not match current revision (${res.rows[0].rev - 1})`
              )
              .toClient();
          }
        }
      }
    ]);

    if (!noteRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    const note = noteRes.rows[0];

    res.locals.update = update.prepare(note.owned_by, [
      { type: 'note', data: note }
    ]);

    // Create response data.
    res.locals.output = {
      rev: note.rev
    };
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
