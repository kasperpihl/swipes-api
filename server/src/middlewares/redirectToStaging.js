export default (req, res, next) => {
  let shouldRedirect = false;

  if (res.locals.config.redirectedVersions) {
    Object.entries(res.locals.config.redirectedVersions).forEach(
      ([header, rVal]) => {
        if (`${rVal}` === `${req.header(`sw-${header}`)}`) {
          shouldRedirect = true;
        }
      }
    );
    if (shouldRedirect) {
      return res.redirect(307, `https://staging.swipesapp.com/v1${req.path}`);
    }
  }

  return next();
};
