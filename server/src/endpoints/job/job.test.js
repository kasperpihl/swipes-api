import endpointCreate from 'src/utils/endpoint/endpointCreate';
import queueRunBatch from 'src/utils/queue/queueRunBatch';
import queueScheduleBatch from 'src/utils/queue/queueScheduleBatch';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    await queueScheduleBatch({
      job_name: 'job.sendEmail.queue.',
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
    await queueRunBatch({
      job_name: 'job.checkAndRun.queue',
      payload: {
        testing: true
      }
    });
  }
);
