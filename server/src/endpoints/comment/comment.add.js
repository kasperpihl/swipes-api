import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';

const expectedInput = {

};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/comment.add',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Create response data.
  res.locals.output = {};
});
