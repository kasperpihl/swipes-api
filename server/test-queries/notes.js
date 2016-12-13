const options = {
  returnChanges: 'always',
  conflict: (id, oldDoc, newDoc) => {
    return r.branch(
      oldDoc('locked_by').ne(null).and(oldDoc('locked_by').ne(newDoc('user_id'))),
      r.branch(
        oldDoc('ts').add(30).gt(newDoc('ts')),
        oldDoc,
        oldDoc.merge(newDoc),
      ),
      oldDoc.merge(newDoc),
    );
  },
};

const objA = {
  ts: r.now(),
  id: '1',
  user_id: 'Kasper',
  locked_by: 'Kasper',
};
const objC = {
  ts: r.now(),
  id: '1',
  user_id: 'Tihomir',
  locked_by: 'Tihomir',
};
const objB = {
  id: '1',
  ts: r.now(),
  user_id: 'Tihomir',
  locked_by: null,
};

r.db('swipes').table('test').insert(objC, options);
