import valjs, {
  object,
} from 'valjs';

export default schema => (req, res, next) => {
  if(res.locals.__skipValResponse) {
    return next();
  }
  let responseData = res.locals.responseData;
  if(typeof responseData !== 'object') {
    return next(new SwipesError(`${req.route.path} valResponseAndSend: expects res.locals.responseData to be set. (and an object)`));
  }

  if (schema) {
    const error = valjs(responseData, object.as(schema));

    if (error) {
      return next(Error(`${req.route.path} valResponseAndSend: ${error}`).info({
        expectedOutput: schema.toString(),
      }));
    }
  }
  
  // Merge in update_available, reload_available and update_url if any...
  Object.assign(responseData, res.locals.__updatesAvailable);

  return res.status(200).json({ ok: true, ...responseData });
};