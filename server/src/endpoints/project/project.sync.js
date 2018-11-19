import endpointCreate from 'src/utils/endpointCreate';
import { transaction } from 'src/utils/db/db';
import { string, object, array, number, bool } from 'valjs';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import randomstring from 'randomstring';
import redisPubClient from 'src/utils/redis/redisPubClient';

const expectedInput = {
  project_id: string.require(),
  rev: number.require(),
  items: object.of(
    object.as({
      title: string,
      assignees: array.of(string)
    })
  ),
  order: object.of(number),
  indent: object.of(number),
  completion: object.of(bool),
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
      rev,
      update_identifier = randomstring.generate(8)
    } = res.locals.input;

    // Prepare for dynamic support of adding values
    const values = [];
    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let text = 'UPDATE projects SET "updated_at" = now(), "rev" = "rev" + 1';
    let returning = ['updated_at', 'project_id', 'rev'];

    Object.entries({ order, indent, completion }).forEach(([key, value]) => {
      if (!value) return;
      text += `, "${key}" = jsonb_merge("${key}", ${insertVariable(
        JSON.stringify(value)
      )})`;
      returning.push(`"${key}"`);
    });

    text += ` WHERE "project_id"=${insertVariable(
      project_id
    )} RETURNING ${returning.join(', ')}`;

    const queries = [
      {
        text,
        values,
        onSuccess: result => {
          if (result.rows[0].rev !== rev + 1) {
            throw Error('out_of_sync')
              .code(400)
              .info(
                `rev did not match current revision (${result.rows[0].rev - 1})`
              );
          }
        }
      }
    ];

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
    updates.push({
      type: 'project',
      data: response.shift().rows[0]
    });
    if (response.length) {
      updates.push(
        ...response.map(res => ({
          type: 'item',
          data: res.rows[0]
        }))
      );
    }
    await redisPubClient.publish(user_id, JSON.stringify(updates));
    // Create response data.
    res.locals.output = { update_identifier, updates2: updates };
  }
);
