import endpointCreate from 'src/utils/endpointCreate';
import { transaction } from 'src/utils/db/db';
import { string, object, array, number } from 'valjs';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

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
  completion: string
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    const { user_id } = res.locals;
    const { project_id, order, indent, completion, items } = res.locals.input;

    // Prepare for dynamic support of adding values
    const values = [];
    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let text = 'UPDATE projects SET "updated_at" = now(), "rev" = "rev" + 1';
    let returning = [];
    console.log(JSON.stringify(order));
    if (order) {
      text += `, "order" = jsonb_merge_recurse("order", ${insertVariable(
        JSON.stringify(order)
      )})`;
      returning.push('"order"');
    }
    if (indent) {
      text += `, "indent" = jsonb_merge_recurse("indent", ${insertVariable(
        JSON.stringify(indent)
      )})`;
      returning.push('"indent"');
    }
    if (completion) {
      text += `, "completion" = jsonb_merge_recurse("completion", ${insertVariable(
        JSON.stringify(completion)
      )})`;
      returning.push('"completion"');
    }

    const queries = [];
    let addProjectQuery = false;

    if (returning.length) {
      addProjectQuery = true;
      returning.push('"updated_at"', '"project_id"');
    }

    text += ` WHERE "project_id"=${insertVariable(
      project_id
    )} RETURNING ${returning.join(', ')}`;

    if (addProjectQuery) {
      queries.push({ text, values });
    }

    // console.log(text);
    // Add new project
    if (items) {
      for (let item_id in items) {
        queries.push(
          sqlInsertQuery(
            'project_items',
            {
              project_id,
              item_id,
              ...items[item_id]
            },
            {
              upsert: 'project_items_pkey',
              returning: ['updated_at', ...Object.keys(items[item_id])].join(
                ', '
              )
            }
          )
        );
      }
    }

    const response = await transaction(queries);
    const result = {};
    if (addProjectQuery) {
      result.project = response.shift().rows[0];
    }
    if (response.length) {
      result.items = response.map(res => res.rows[0]);
    }

    // Create response data.
    res.locals.output = { result };
  }
);
