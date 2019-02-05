import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import redisPublish from 'src/utils/redis/redisPublish';

const expectedInput = {
  channel: string.require(),
  payload: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    type: 'notAuthed'
  },
  async (req, res, next) => {
    // Get inputs
    const input = res.locals.input;
    await redisPublish(input.channel, input.payload);
  }
);
