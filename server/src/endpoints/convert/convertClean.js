export default async function convertClean({ organization_id, c }) {
  await c.query(
    `
      DELETE FROM discussions
      WHERE owned_by = '${organization_id}';
      DELETE FROM projects
      WHERE owned_by = '${organization_id}';
      DELETE FROM permissions
      WHERE owned_by = '${organization_id}';
      DELETE FROM files
      WHERE owned_by = '${organization_id}';
      DELETE FROM notes
      WHERE owned_by = '${organization_id}';
      DELETE FROM organizations
      WHERE organization_id = '${organization_id}';
      DELETE from users
      WHERE activated = false;
    `
  );
  console.log('CLEAN COMPLETED...');
}
