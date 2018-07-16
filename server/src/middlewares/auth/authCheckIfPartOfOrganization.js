import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

export default async (req, res, next) => {
  const {
    user_id,
    organization_id,
  } = res.locals;

  // if we still have some endpoint that does not require organization_id
  // but they should!
  if (!organization_id) {
    return next();
  }

  const query = r.table('organizations').get(organization_id)('active_users').contains(user_id);
  const partOfOrganization = await dbRunQuery(query);

  if (partOfOrganization === false) {
    throw Error('not_authed');
  }

  return next();
};
