import endpointCreate from 'src/utils/endpointCreate';
import { transaction } from 'src/utils/db/db';
import { string, object, array, number, bool } from 'valjs';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import randomstring from 'randomstring';
import redisPubClient from 'src/utils/redis/redisPubClient';

const expectedInput = {
  project_id: string,
  rev: number.require(),
  tasks_by_id: object.of(
    object.as({
      title: string,
      assignees: array.of(string)
    })
  ),
  ordering: object.of(number),
  indention: object.of(number),
  completion: object.of(bool),
  update_identifier: string
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id } = res.locals;
    let {
      project_id,
      ordering,
      indention,
      completion,
      tasks_by_id,
      rev,
      update_identifier = randomstring.generate(8)
    } = res.locals.input;

    const addQuery = [];
    if (!project_id) {
      project_id = idGenerate('P');
      addQuery.push({
        text: 'INSERT INTO projects (id, created_by) VALUES ($1, $2)',
        values: [project_id, user_id]
      });
    }

    // Prepare for dynamic support of adding values
    const values = [];
    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let text = 'UPDATE projects SET "updated_at" = now(), "rev" = "rev" + 1';
    let returning = ['updated_at', 'project_id', 'rev'];

    Object.entries({ ordering, indention, completion }).forEach(
      ([key, value]) => {
        if (!value) return;
        text += `, "${key}" = jsonb_merge("${key}", ${insertVariable(
          JSON.stringify(value)
        )})`;
        returning.push(`"${key}"`);
      }
    );

    text += ` WHERE "project_id"=${insertVariable(
      project_id
    )} RETURNING ${returning.join(', ')}`;

    const queries = addQuery.concat([
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
    ]);

    if (tasks_by_id) {
      for (let task_id in tasks_by_id) {
        let keys = tasks_by_id[task_id];
        if (!keys) keys = { deleted: true };
        queries.push(
          sqlInsertQuery(
            'project_items',
            {
              project_id,
              task_id,
              ...keys
            },
            {
              upsert: 'project_items_pkey',
              returning: [
                'project_id',
                'task_id',
                'updated_at',
                ...Object.keys(keys)
              ].join(', ')
            }
          )
        );
      }
    }

    const response = await transaction(queries);
    if (addQuery.length) {
      response.shift();
    }

    const updates = [{ type: 'project', data: response.shift().rows[0] }];

    updates[0].data.tasks_by_id = {};
    response.forEach(res => {
      const item = res.rows[0];
      updates[0].data.tasks_by_id[item.id] = item;
    });

    await redisPubClient.publish(user_id, JSON.stringify(updates));

    // Create response data.
    res.locals.output = { update_identifier, updates2: updates };
  }
);
