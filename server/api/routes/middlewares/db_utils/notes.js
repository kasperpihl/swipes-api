import r from 'rethinkdb';
import db from '../../../../db';

const dbNotesInsert = ({ note }) => {
  const q =
    r.table('notes')
      .insert(note, {
        returnChanges: 'always',
        conflict: (id, oldDoc, newDoc) => {
          /*
          if(oldDoc.locked_by && oldDoc.locked_by !== newDoc.locked_by){
            const oldTs = new Date(oldDoc.ts).getTime();
            const newTs = new Date(newDoc.ts).getTime();
            if(oldTs + 30sec > newTs){
              reject changes!
            }
          }
          */
          return oldDoc.merge(newDoc);
        },
      });

  return db.rethinkQuery(q);
};

export {
  dbNotesInsert,
};
