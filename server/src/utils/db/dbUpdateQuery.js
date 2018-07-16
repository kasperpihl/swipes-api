import r from 'rethinkdb';

export default (table, id, obj, options = {}) => {
  if (typeof options.return_changes === 'undefined') {
    options.return_changes = true;
  }

  return r.table(table).get(id).update(obj, options);
};
