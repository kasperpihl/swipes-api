import r from 'rethinkdb';
import db from '../db';

const dbOrganizationsGetSingle = ({ organization_id }) => {
  const q = r.table('organizations').get(organization_id);

  return db.rethinkQuery(q);
};

export default dbOrganizationsGetSingle;
