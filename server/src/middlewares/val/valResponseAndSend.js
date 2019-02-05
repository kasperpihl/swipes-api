import valjs, { object } from 'valjs';
import logger from 'src/utils/logger';
import logGetObject from 'src/utils/log/logGetObject';

export default schema => async (req, res, next) => {
  let output = res.locals.output;
  if (typeof output !== 'object') {
    output = {};
  }

  if (schema) {
    const validationError = valjs(output, object.as(schema));

    if (validationError) {
      throw Error('Validation error')
        .info({ expectedOutput: schema.toString(), validationError })
        .toClient();
    }
  }

  // Merge in update_available, reload_available and update_url if any...
  Object.assign(output, res.locals.__updatesAvailable);

  const logObject = logGetObject(req, res);
  logObject.output = output;

  logger.log('info', logObject);

  return res
    .status(200)
    .json({ ok: true, ...output, log_id: logObject.request_id });
};
