import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import { string, object, array, number, bool } from 'valjs';
import channelAddSystemMessage from 'src/utils/channel/channelAddSystemMessage';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import update from 'src/utils/update';
import randomstring from 'randomstring';

const expectedInput = {
  project_id: string,
  rev: number.require(),
  tasks_by_id: object.of(
    object.as({
      title: string,
      assignees: array.of(string)
    })
  ),
  completion_percentage: number,
  ordering: object.of(number),
  indention: object.of(number),
  completion: object.of(bool),
  update_identifier: string
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'project_id'
  },
  async (req, res) => {
    let {
      project_id,
      ordering,
      indention,
      completion,
      completion_percentage,
      tasks_by_id,
      rev,
      update_identifier = randomstring.generate(8)
    } = res.locals.input;

    // Prepare for dynamic support of adding values
    const values = [];
    const insertVariable = value => {
      values.push(value);
      return `$${values.length}`;
    };

    let text = 'UPDATE projects SET updated_at = now(), rev = rev + 1';
    let returning = ['updated_at', 'project_id', 'rev'];

    if (typeof completion_percentage === 'number') {
      text += `, completion_percentage = ${insertVariable(
        completion_percentage
      )}`;
      returning.push('completion_percentage');
    }

    Object.entries({ ordering, indention, completion }).forEach(
      ([key, value]) => {
        if (!value) return;
        text += `, ${key} = jsonb_merge(${key}, ${insertVariable(
          JSON.stringify(value)
        )})`;
        returning.push(key);
      }
    );

    text += ` WHERE project_id=${insertVariable(
      project_id
    )} RETURNING ${returning.join(', ')}`;

    const queries = [
      {
        text,
        values,
        onSuccess: result => {
          if (!result.rows.length) {
            throw Error('Not found')
              .code(404)
              .toClient();
          }
          if (result.rows[0].rev !== rev + 1) {
            throw Error('Out of sync')
              .code(400)
              .info(
                `rev did not match current revision (${result.rows[0].rev - 1})`
              )
              .toClient();
          }
        }
      }
    ];

    if (tasks_by_id) {
      for (let task_id in tasks_by_id) {
        let keys = tasks_by_id[task_id];
        if (!keys) keys = { deleted: true };
        if (keys.assignees) {
          keys.assignees = JSON.stringify(keys.assignees);
        }
        if (keys.attachment) {
          keys.attachment = JSON.stringify(keys.attachment);
        }
        if (keys.title) {
          keys.title = keys.title.substr(0, 255);
        }
        const query = sqlInsertQuery(
          'project_tasks',
          {
            project_id,
            task_id,
            ...keys
          },
          {
            upsert: 'project_tasks_pkey',
            returning: [
              'project_id',
              'task_id',
              'updated_at',
              ...Object.keys(keys)
            ].join(', ')
          }
        );
        if (keys.assignees) {
          query.text += `, (
            SELECT assignees
            FROM project_tasks 
            WHERE project_id = $${query.values.push(project_id)}
            AND task_id = $${query.values.push(task_id)}
          ) as old_assignees`;
        }
        queries.push(query);
      }
    }

    const response = await transaction(queries);

    const updates = [{ type: 'project', data: response.shift().rows[0] }];

    updates[0].data.tasks_by_id = {};
    const itemsWithOldAssignees = [];
    response.forEach(res => {
      const item = res.rows[0];
      if (item.old_assignees) {
        itemsWithOldAssignees.push({
          ...item
        });
        delete item.old_assignees;
      }
      updates[0].data.tasks_by_id[item.task_id] = item;
    });

    // Create response data.
    res.locals.backgroundInput = {
      itemsWithOldAssignees,
      project_id
    };

    res.locals.output = { update_identifier, rev: updates[0].data.rev };
    res.locals.update = update.prepare(project_id, updates);
  }
).background(async (req, res) => {
  const { itemsWithOldAssignees, project_id } = res.locals.input;
  const { user_id } = res.locals;
  await update.send(res.locals.update);

  const projectRes = await query(
    `
      SELECT owned_by, title
      FROM projects
      WHERE project_id = $1
    `,
    [project_id]
  );

  const project = projectRes.rows[0];

  // Don't notify for personal projects
  if (project.owned_by.startsWith('U')) {
    return;
  }

  const userRes = await query(
    `
      SELECT first_name
      FROM users
      WHERE user_id = $1
    `,
    [user_id]
  );
  const assignor = userRes.rows[0];

  for (let i = 0; i < itemsWithOldAssignees.length; i++) {
    const item = itemsWithOldAssignees[i];
    for (let j = 0; j < item.assignees.length; j++) {
      const newAssigneeId = item.assignees[j];
      if (
        // newAssigneeId !== user_id &&
        !item.old_assignees ||
        item.old_assignees.indexOf(newAssigneeId) === -1
      ) {
        await channelAddSystemMessage(
          project.owned_by,
          newAssigneeId,
          `${assignor.first_name} assigned you to a task in ${project.title}`
        );
      }
    }
  }
  // console.log(itemsWithOldAssignees);
});
