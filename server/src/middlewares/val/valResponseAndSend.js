import valjs, { object } from 'valjs';

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

  return res.status(200).json({ ok: true, ...output });
};
