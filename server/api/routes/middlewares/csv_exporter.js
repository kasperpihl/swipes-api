import {
  string,
} from 'valjs';
import {
  dbMilestonesGetNoClosedByUserId,
} from './db_utils/milestones';
import {
  valLocals,
} from '../../utils';

const createCSVFile = (milestones) => {
  const map = milestones.map((milestone) => {
    const {
      title,
      goal_order,
    } = milestone;
    const {
      done,
      later,
      now,
    } = goal_order;
    const total = done.length + later.length + now.length;

    return [
      title,
      done.length,
      total,
    ];
  });

  return map.join('\r\n');
};

const planCSVExporter = valLocals('planCSVExporter', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;

  dbMilestonesGetNoClosedByUserId({ user_id })
    .then((results) => {
      const file = createCSVFile(results.milestones);

      res.writeHead(200, {
        'Content-Type': 'txt',
        'Content-disposition': 'attachment;filename=plans.csv',
        'Content-Length': file.length,
      });

      return res.end(Buffer.from(file), 'binary');
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  planCSVExporter,
};
