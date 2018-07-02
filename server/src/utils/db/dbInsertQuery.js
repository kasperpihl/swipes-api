import r from 'rethinkdb';

export default (table, obj, options = {}) => {
  if(typeof options.return_changes === 'undefined') {
    options.return_changes = true;
  }
  if(!Array.isArray(obj)) {
    obj = [obj];
  }
  obj.forEach((o) => {
    o.updated_at = r.now();
    o.created_at = r.now();
  });
  
  return r.table(table).insert(obj, options);
}