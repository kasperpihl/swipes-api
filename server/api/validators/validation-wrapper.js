"use strict";

import validate from 'validate.js';
import SwipesError from '../../middlewares/swipes-error/swipes-error';

const validatorModelMiddleware = (fn) => {
  return (req, res, next) => {
    const model = fn(res.locals);

    if (model instanceof SwipesError) {
      return next(model);
    }

    res.locals.validatorModel = model;

    return next();
  }
}

const validatorMiddleware = (model = null) => {
  return (req, res, next) => {
    const {
      validatorModel
    } = res.locals;
    const modelToValidate = model ? model : validatorModel;

    if (!modelToValidate) {
      return next(new SwipesError('There is no model to validate!'));
    }

    const validation = validate(res.locals, modelToValidate);

    if (validation) {
      console.log(res.locals);
      console.log(modelToValidate);
      console.log(validation);
      return next(new SwipesError('Some property in the request is not valid!'));
    }

    return next();
  }
}

export {
  validatorMiddleware,
  validatorModelMiddleware
}
