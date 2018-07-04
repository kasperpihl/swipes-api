export default (err, req, res, next) => {
  if (typeof err === 'object' && err.name === 'SwipesError') {
    if (typeof err.extra === 'string') {
      err.extra = {
        message: err.extra,
      };
    }
    return res.status(400).json({
      ok: false,
      error: err.message,
      ...err.extra,
    });
  }

  return next(err);
};