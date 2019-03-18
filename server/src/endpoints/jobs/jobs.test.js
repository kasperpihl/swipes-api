import endpointCreate from 'src/utils/endpoint/endpointCreate';
import queueSendJob from 'src/utils/queue/queueSendJob';

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    console.log('adding job');
    queueSendJob('jobs.add', {
      testing: true
    });
  }
);
