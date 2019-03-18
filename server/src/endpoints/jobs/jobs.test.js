import endpointCreate from 'src/utils/endpoint/endpointCreate';
import queueSendJob from 'src/utils/queue/queueSendJob';
import queueScheduleJob from 'src/utils/queue/queueScheduleJob';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    await queueScheduleJob({
      job: 'jobs.emails',
      identifier: res.locals.user_id,
      payload: {
        hi: true
      },
      time: 1,
      owned_by: res.locals.user_id
    });
    console.log('scheduled job');
    await sleep(5000);
    console.log('adding job');
    await queueSendJob('jobs.checkAndRun', {
      testing: true
    });
  }
);
