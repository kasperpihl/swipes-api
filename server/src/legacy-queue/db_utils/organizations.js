import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const dbOrganizationsGetSingle = ({ organization_id }) => {
  const q = r.table('organizations').get(organization_id);

  return dbRunQuery(q);
};

export default dbOrganizationsGetSingle;
