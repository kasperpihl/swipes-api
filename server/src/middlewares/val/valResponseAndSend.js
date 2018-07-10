import valjs, {
  object,
} from 'valjs';

export default schema => (req, res, next) => {
  if(res.locals.__skipValResponse) {
    return next();
  }
  const output = res.locals.output;
  if(typeof output !== 'object') {
    return next(new SwipesError(`${req.route.path} valResponseAndSend: expects res.locals.output to be set. (and an object)`));
  }

  if (schema) {
    const error = valjs(output, object.as(schema));

    if (error) {
      return next(Error(`${req.route.path} valResponseAndSend: ${error}`).info({
        expectedOutput: schema.toString(),
      }));
    }
  }
  
  // Merge in update_available, reload_available and update_url if any...
  Object.assign(output, res.locals.__updatesAvailable);

  return res.status(200).json({ ok: true, ...output });
};