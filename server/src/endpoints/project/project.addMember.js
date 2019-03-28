import { object, array, string } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  project_id: string.require(),
  user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    // Get inputs
    const input = res.locals.input;

    // Create response data.
    res.locals.output = {};
  }
);
