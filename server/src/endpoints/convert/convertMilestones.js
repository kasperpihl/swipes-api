import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';

import randomstring from 'randomstring';
import idGenerate from 'src/utils/idGenerate';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default async function convertMilestones({
  organization_id,
  c,
  org,
  milestones,
  goalsById
}) {
  ////////////////////////
  // PROJECTS FROM MILESTONES
  ////////////////////////
  console.log('CONVERTING MILESTONES ' + milestones.length);
  for (let i = 0; i < milestones.length; i++) {
    const milestone = milestones[i];
    if (milestone.archived) continue;
    const projectId = idGenerate('PR-', 15);
    const totalOrder = milestone.goal_order.later
      .concat(milestone.goal_order.now)
      .concat(milestone.goal_order.done);

    const ordering = {};
    const indention = {};
    const completion = {};
    const tasks_by_id = [];
    let orderCount = 0;
    let numberOfCompleted = 0;
    totalOrder.forEach(gId => {
      const goal = goalsById[gId];
      const tId = randomstring.generate(6);
      tasks_by_id.push({
        project_id: projectId,
        task_id: tId,
        title: goal.title,
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
          title: step.title,
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
          title: milestone.title,
          created_by: milestone.created_by,
          completion_percentage: Math.round(
            (numberOfCompleted / orderCount) * 100
          ),
          ordering: JSON.stringify(ordering),
          completion: JSON.stringify(completion),
          indention: JSON.stringify(indention),
          owned_by: organization_id
        })
      );

      await c.query(sqlInsertQuery('project_tasks', tasks_by_id));
      await c.query(
        sqlInsertQuery(
          'project_opens',
          org.active_users.map(user_id => ({
            user_id,
            project_id: projectId,
            opened_at: milestone.updated_at
          }))
        )
      );

      const projectPerRes = await c.query(
        sqlPermissionInsertQuery(projectId, 'public', organization_id)
      );
      console.log('INSERTED PROJECT ' + projectId);
      // console.log(projectRes.rows, taskRes.rows);
    }

    // const insertProjectRes = await c.query
  }
}
