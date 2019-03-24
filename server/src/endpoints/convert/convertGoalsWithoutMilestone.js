import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

import randomstring from 'randomstring';
import idGenerate from 'src/utils/idGenerate';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default async function convertGoalsWithoutMilestone({
  team_id,
  c,
  team,
  goalsNoMilestone
}) {
  ////////////////////////
  // PROJECTS FROM MILESTONES
  ////////////////////////
  console.log('CONVERTING GOALS WITHOUT MILESTONE ' + goalsNoMilestone.length);
  const projectId = idGenerate('P', 8, true);

  const ordering = {};
  const indention = {};
  const completion = {};
  const title = 'Misc';
  const tasks_by_id = [];
  let orderCount = 0;
  let numberOfCompleted = 0;
  goalsNoMilestone.forEach(goal => {
    if (goal.archived || goal.completed_at) return;
    const tId = randomstring.generate(6);
    tasks_by_id.push({
      project_id: projectId,
      task_id: tId,
      title: goal.title.slice(0, 254),
      created_at: goal.created_at || new Date().toISOString(),
      assignees: JSON.stringify(goal.assignees || [])
    });
    ordering[tId] = orderCount++;
    indention[tId] = 0;
    completion[tId] = !!goal.completed_at;
    if (completion[tId]) {
      numberOfCompleted++;
    }
    goal.step_order.forEach(sId => {
      const sId2 = randomstring.generate(6);
      const step = goal.steps[sId];
      indention[sId2] = 1;
      ordering[sId2] = orderCount++;
      completion[sId2] = !!step.completed_at;
      if (completion[sId2]) {
        numberOfCompleted++;
      }
      tasks_by_id.push({
        project_id: projectId,
        task_id: sId2,
        title: step.title.slice(0, 254),
        created_at: step.created_at || new Date().toISOString(),
        assignees: JSON.stringify(step.assignees || [])
      });
    });
  });
  if (orderCount > 0) {
    // console.log(ordering, indention, completion);

    const projectRes = await c.query(
      sqlInsertQuery('projects', {
        project_id: projectId,
        title,
        created_by: team_id,
        completion_percentage: Math.round(
          (numberOfCompleted / orderCount) * 100
        ),
        ordering: JSON.stringify(ordering),
        completion: JSON.stringify(completion),
        indention: JSON.stringify(indention),
        owned_by: team_id
      })
    );

    await c.query(sqlInsertQuery('project_tasks', tasks_by_id));
    await c.query(
      sqlInsertQuery(
        'project_opens',
        team.active_users.map(user_id => ({
          user_id,
          project_id: projectId,
          opened_at: 'now()'
        }))
      )
    );

    const projectPerRes = await c.query(
      sqlPermissionInsertQuery(projectId, 'public', team_id)
    );
    console.log('INSERTED PROJECT ' + projectId);
    // console.log(projectRes.rows, taskRes.rows);
  }

  // const insertProjectRes = await c.query
}
