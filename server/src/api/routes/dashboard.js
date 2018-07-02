import express from 'express';
import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/dashboardd_awesome_cat_rainbow',
  (req, res, next) => {
    const sw = r.db('swipes');
    const promises = [
      sw.table('users').filter({ activated: true }).count(),
      sw.table('users').filter({ activated: false }).count(),
      sw.table('organizations').count(),
      sw.table('goals').count(),
      sw.table('milestones').count(),
    ].map(q => dbRunQuery(q));

    Promise.all(promises).then((results) => {
      res.json({
        users: results[0],
        pendingUsers: results[1],
        organizations: results[2],
        goals: results[3],
        milestones: results[4],
      });
    });
  },
 );

notAuthed.all('/update_attachments',
  (req, res, next) => {
    const q = r.table('goals').count();

    dbRunQuery(q)
    .then((count) => {
      res.locals.count = count;

      return next();
    });
  },
  (req, res, next) => {
    const count = res.locals.count;
    const itemsPerPage = 50;
    const promises = [];
    let pages = Math.ceil(count / itemsPerPage);
    let pageNum = 1;

    while (pages >= 0) {
      const q =
          r.table('goals')
          .orderBy(r.desc('created_at'))
          .slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage)
          .pluck('attachments', 'attachment_order', 'id');

      promises.push(dbRunQuery(q));

      pageNum += 1;
      pages -= 1;
    }

    Promise.all(promises)
      .then((goals) => {
        const flattened = goals.reduce((a, b) => {
          return a.concat(b);
        });
        res.locals.goals = flattened;

        return next();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  (req, res, next) => {
    const goals = res.locals.goals;
    const filteredGoalsWithOldAttachmentStructure = goals.filter((goal) => {
      let isIt = false;

      goal.attachment_order.forEach((aId) => {
        isIt = !goal.attachments[aId].link;
      });

      return isIt;
    });

    res.locals.goals = filteredGoalsWithOldAttachmentStructure;

    return next();
  },
  (req, res, next) => {
    const goals = res.locals.goals;

    goals.map((goal) => {
      goal.attachment_order.forEach((aId) => {
        if (!goal.attachments[aId].link) {
          goal.attachments[aId] = {
            created_at: r.now(),
            created_by: null,
            id: aId,
            link: {
              created_at: r.now(),
              checksum: r.table('links_permissions').get(goal.attachments[aId].shortUrl)('link_id'),
              permission: {
                short_url: goal.attachments[aId].shortUrl,
              },
              service: {
                id: goal.attachments[aId].id,
                name: goal.attachments[aId].name,
                type: goal.attachments[aId].type,
              },
              title: goal.attachments[aId].title,
              updated_at: r.now(),
            },
          };
        }
      });

      return goal;
    });

    res.locals.goals = goals;

    return next();
  },
  (req, res, next) => {
    const goals = res.locals.goals;
    const promises = [];

    goals.forEach((goal) => {
      const q = r.table('goals').get(goal.id).update({
        attachments: goal.attachments,
      }, {
        nonAtomic: true,
      });

      promises.push(dbRunQuery(q));
    });

    Promise.all(promises)
      .then(() => {
        return next();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  (req, res, next) => {
    return res.json({});
  },
 );

export {
  authed,
  notAuthed,
};
