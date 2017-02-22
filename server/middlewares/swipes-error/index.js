import SwipesError from './swipes-error';

const swipesErrorMiddleware = (err, req, res, next) => {
  console.log(err.name);
  if (typeof err === 'object' && err.name === 'SwipesError') {
    console.log('Im here');
    return res.status(200).json({
      ok: false,
      error: err.message,
    });
  }

  return next(err);
};

export {
  swipesErrorMiddleware,
  SwipesError,
};
