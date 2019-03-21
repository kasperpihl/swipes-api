import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';

export default function sqlOnboardingProjectQueries(userId, firstName) {
  const projectId = idGenerate('PR-', 15);

  const tasks = [
    '',
    'Press Tab to make subtasks 👉',
    'Press Shift+Tab to 👈'
  ].map(title => ({
    project_id: projectId,
    task_id: idGenerate(6),
    title
  }));

  const ordering = {};
  const indention = {};
  const completion = {};

  tasks.forEach(({ task_id }, i) => {
    ordering[task_id] = i;
    indention[task_id] = i === 2 ? 1 : 0;
    completion[task_id] = false;
  });

  return [
    sqlInsertQuery('projects', {
      project_id: projectId,
      title: 'My First Project',
      created_by: userId,
      ordering: JSON.stringify(ordering),
      completion: JSON.stringify(completion),
      indention: JSON.stringify(indention),
      owned_by: userId
    }),
    sqlInsertQuery('project_tasks', tasks),
    sqlPermissionInsertQuery(projectId, 'public', userId)
  ];
}
