import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

export default async (req, res, next) => {
  const { user_id, organization_id } = res.locals;

  if (
    !organization_id ||
    typeof organization_id !== 'string' ||
    !organization_id.startsWith('O')
  ) {
    throw Error('not_authed');
  }

  const query = r
    .table('organizations')
    .get(organization_id)('active_users')
    .contains(user_id);
  const partOfOrganization = await dbRunQuery(query);

  if (partOfOrganization === false) {
    throw Error('not_authed');
  }

  return next();
};
