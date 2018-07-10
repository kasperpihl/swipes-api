import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';

const expectedInput = {
  discussion_id: string.require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/discussion.unfollow',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Create response data.
  res.locals.output = {};
});
