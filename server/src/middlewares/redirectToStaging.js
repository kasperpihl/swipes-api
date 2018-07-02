import SwipesError from 'src/utils/SwipesError';

export default (req, res, next) => {
  let shouldRedirect = false;

  if (res.locals.config.redirectToStaging) {
    Object.entries(res.locals.config.redirectToStaging).forEach(([header, rVal]) => {
      if (`${rVal}` === `${req.header(`sw-${header}`)}`) {
        shouldRedirect = true;
      }
    });
    if (shouldRedirect) {
      return res.redirect(307, `https://staging.swipesapp.com/v1${req.path}`);
    }
  }

  if (res.locals.config.maintenance) {
    return next(new SwipesError('maintenance', { maintenance: true }));
  }

  return next();
}