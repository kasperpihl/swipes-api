// USE THIS SCRIPT ONLY AFTER MAKING BACKUPS ON THE DATABASE!!!!!

import r from 'rethinkdb';
import Promise from 'bluebird';
import dbRunQuery from 'src/utils/db/dbRunQuery';

// const dbConfig = null;
const dbConfig = {
  host: 'rethinkdb-live5931.cloudapp.net',
  port: 28015,
  db: 'swipes',
  user: 'swipes-live',
  password: '',
};

if (!dbConfig) {
  console.log('Don\'t you need the live config here?!?!');

  process.exit();
}

const organization_id = 'ONY8E94FL';
const organizationQ = r.table('organizations').get(organization_id);
const usersQ = r.table('users').filter(u => u('organizations').contains(organization_id));
const goalsQ = r.table('goals').getAll(organization_id, { index: 'organization_id' }).coerceTo('ARRAY');
const filesQ = r.table('files').getAll(organization_id, { index: 'organization_id' }).coerceTo('ARRAY');
const milestonesQ = r.table('milestones').getAll(organization_id, { index: 'organization_id' }).coerceTo('ARRAY');
const notesQ = r.table('notes').getAll(organization_id, { index: 'organization_id' }).coerceTo('ARRAY');
const waysQ = r.table('ways').getAll(organization_id, { index: 'organization_id' }).coerceTo('ARRAY');
const postsQ = r.table('posts').getAll(organization_id, { index: 'organization_id' }).coerceTo('ARRAY');

console.log('Picking information!');

const promiseArrayQ = [
  dbRunQuery(organizationQ),
  dbRunQuery(usersQ),
  dbRunQuery(goalsQ),
  dbRunQuery(filesQ),
  dbRunQuery(milestonesQ),
  dbRunQuery(notesQ),
  dbRunQuery(waysQ),
  dbRunQuery(postsQ),
];
const link_ids = [];
let links = [];
let organization = {};
let users = [];
let goals = [];
let files = [];
let milestones = [];
let notes = [];
let ways = [];
let posts = [];
let permissions = [];

Promise.all(promiseArrayQ)
  .then((results) => {
    organization = results[0];
    users = results[1];
    goals = results[2];
    files = results[3];
    milestones = results[4];
    notes = results[5];
    ways = results[6];
    posts = results[7];

    console.log(organization);
    console.log(users.length);
    console.log(goals.length);
    console.log(files.length);
    console.log(milestones.length);
    console.log(notes.length);
    console.log(ways.length);
    console.log(posts.length);

    goals.forEach((goal) => {
      goal.attachment_order.forEach((a_id) => {
        if (goal.attachments[a_id].link) {
          link_ids.push(goal.attachments[a_id].link.checksum);
        }
      });
    });

    const linksQ = r.table('links').getAll(...link_ids).coerceTo('ARRAY');

    return dbRunQuery(linksQ);
  })
  .then((linksRes) => {
    console.log(linksRes.length);
    links = linksRes;

    const permissionsQ = [];

    links.forEach((link) => {
      permissionsQ.push(dbRunQuery(r.table('links_permissions').filter({ link_id: link.checksum }).nth(0)));
    });

    return Promise.all(permissionsQ);
  })
  .then((links_permissions) => {
    console.log(links_permissions.length);
    permissions = links_permissions;

    console.log('Deleting stuff... don\'t judge!');

    // BE CAREFUL WITH THESE GUYS!!!!! DELETING IS NOT FUN!!!

    // const organizationQ = r.table('organizations').get(organization_id).delete();
    // const usersQ = r.table('users').filter(u => u('organizations').contains(organization_id)).delete();
    // const goalsQ = r.table('goals').getAll(organization_id, { index: 'organization_id' }).delete();
    // const filesQ = r.table('files').getAll(organization_id, { index: 'organization_id' }).delete();
    // const milestonesQ = r.table('milestones').getAll(organization_id, { index: 'organization_id' }).delete();
    // const notesQ = r.table('notes').getAll(organization_id, { index: 'organization_id' }).delete();
    // const waysQ = r.table('ways').getAll(organization_id, { index: 'organization_id' }).delete();
    // const postsQ = r.table('posts').getAll(organization_id, { index: 'organization_id' }).delete();

    const promiseArrayQ = [
      dbRunQuery(organizationQ, { dbConfig }),
      dbRunQuery(usersQ, { dbConfig }),
      dbRunQuery(goalsQ, { dbConfig }),
      dbRunQuery(filesQ, { dbConfig }),
      dbRunQuery(milestonesQ, { dbConfig }),
      dbRunQuery(notesQ, { dbConfig }),
      dbRunQuery(waysQ, { dbConfig }),
      dbRunQuery(postsQ, { dbConfig }),
    ];

    return Promise.all(promiseArrayQ);
  })
  .then(() => {
    console.log('Inserting stuff!');

    const organizationQ = r.table('organizations').insert(organization);
    const usersQ = r.table('users').insert(users);
    const goalsQ = r.table('goals').insert(goals);
    const filesQ = r.table('files').insert(files);
    const milestonesQ = r.table('milestones').insert(milestones);
    const notesQ = r.table('notes').insert(notes);
    const waysQ = r.table('ways').insert(ways);
    const postsQ = r.table('posts').insert(posts);
    const linksQ = r.table('links').insert(links, {
      conflict: 'replace',
    });
    const linksPermisstionsQ = r.table('links_permissions').insert(permissions, {
      conflict: 'replace',
    });

    const promiseArrayQ = [
      dbRunQuery(organizationQ),
      dbRunQuery(usersQ),
      dbRunQuery(goalsQ),
      dbRunQuery(filesQ),
      dbRunQuery(milestonesQ),
      dbRunQuery(notesQ),
      dbRunQuery(waysQ),
      dbRunQuery(postsQ),
      dbRunQuery(linksQ),
      dbRunQuery(linksPermisstionsQ),
    ];

    return Promise.all(promiseArrayQ);
  })
  .then(() => {
    console.log('Done!');

    process.exit();
  });
