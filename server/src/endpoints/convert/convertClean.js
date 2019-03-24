export default async function convertClean({ team_id, c }) {
  await c.query(
    `
      DELETE FROM discussions
      WHERE owned_by = '${team_id}';
      DELETE FROM projects
      WHERE owned_by = '${team_id}';
      DELETE FROM permissions
      WHERE owned_by = '${team_id}';
      DELETE FROM files
      WHERE owned_by = '${team_id}';
      DELETE FROM notes
      WHERE owned_by = '${team_id}';
      DELETE FROM teams
      WHERE team_id = '${team_id}';
      DELETE from users
      WHERE activated = false;
    `
  );
  console.log('CLEAN COMPLETED...');
}
