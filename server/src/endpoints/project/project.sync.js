import endpointCreate from 'src/utils/endpointCreate';
import { transaction } from 'src/utils/db/db';
import { string, object, array, number } from 'valjs';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import randomstring from 'randomstring';

const expectedInput = {
  project_id: string.require(),
  items: object.of(
    object.as({
      title: string,
      assignees: array.of(string)
    })
  ),
  order: object.of(number),
  indent: object.of(number),
  completion: object.of(string),
  update_identifier: string
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    const { user_id } = res.locals;
    const {
      project_id,
      order,
      indent,
      completion,
      items,
      update_identifier = randomstring(8)
    } = res.locals.input;

    // Prepare for dynamic support of adding values
    const values = [];
    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let text = 'UPDATE projects SET "updated_at" = now(), "rev" = "rev" + 1';
    let returning = [];
    Object.entries({ order, indent, completion }).forEach(([key, value]) => {
      if (!value) return;
      text += `, "${key}" = jsonb_merge("${key}", ${insertVariable(
        JSON.stringify(value)
      )})`;
      returning.push(`"${key}"`);
    });

    const queries = [];
    let addProjectQuery = false;

    if (returning.length) {
      addProjectQuery = true;
      returning.push('updated_at', 'project_id', 'rev');
    }

    text += ` WHERE "project_id"=${insertVariable(
      project_id
    )} RETURNING ${returning.join(', ')}`;

    if (addProjectQuery) {
      queries.push({ text, values });
    }

    if (items) {
      for (let item_id in items) {
        let keys = items[item_id];
        if (!keys) keys = { deleted: true };
        queries.push(
          sqlInsertQuery(
            'project_items',
            {
              project_id,
              item_id,
              ...keys
            },
            {
              upsert: 'project_items_pkey',
              returning: [
                'project_id',
                'item_id',
                'updated_at',
                ...Object.keys(keys)
              ].join(', ')
            }
          )
        );
      }
    }

    const response = await transaction(queries);
    const updates = [];
    if (addProjectQuery) {
      updates.push({
        type: 'project',
        data: response.shift().rows[0]
      });
    }
    if (response.length) {
      updates.push(
        ...response.map(res => ({
          type: 'item',
          data: res.rows[0]
        }))
      );
    }

    // Create response data.
    res.locals.output = { update_identifier, updates2: updates };
  }
);
