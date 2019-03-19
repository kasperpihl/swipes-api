import endpointCreate from 'src/utils/endpoint/endpointCreate';
import queueSendJob from 'src/utils/queue/queueSendJob';
import queueScheduleJobBatch from 'src/utils/queue/queueScheduleJobBatch';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    await queueScheduleJobBatch({
      job_name: 'job.sendEmail',
      identifier: res.locals.user_id,
      payload: {
        hi: true
      },
      run_at: 1,
      owned_by: res.locals.user_id
    });
    console.log('scheduled job');
    await sleep(5000);
    console.log('adding job');
    await queueSendJob('job.checkAndRun', {
      testing: true
    });
  }
);
