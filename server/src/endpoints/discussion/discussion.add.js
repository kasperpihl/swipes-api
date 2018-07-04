import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';

const expectedInput = {
  topic: string.min(1).require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/discussion.add',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Create response data.
  res.locals.responseData = {};
});
