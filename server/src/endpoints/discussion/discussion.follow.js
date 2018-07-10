import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';

const expectedInput = {
  discussion_id: string.require(),
};
const expectedOutput = {};

export default endpoint('/discussion.follow')
.input(expectedInput)
.handler(async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  // Do queries and stuff here on the endpoint

  // Things to the background
  res.locals.backgroundInput = {};

  // Create response data.
  res.locals.output = {};
})
.output(expectedOutput)
.background(async (req, res, next) => {
  // This is backgroundInput from the handler...
  const input = res.locals.input;

});
