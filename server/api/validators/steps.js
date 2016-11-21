"use strict";

import {
  validatorMiddleware
} from './validation-wrapper';

const goal_id = {
  presence: true
}

const data = {
  presence: true
}

const message = {
  presence: true
}

const step_id = {
  presence: true
}

const payload = {
  presence: true
}

const validateStepsSubmit = validatorMiddleware({
  goal_id,
  data,
  message
});

const validateStepsUpdate = validatorMiddleware({
  goal_id,
  step_id,
  payload
});

export {
  validateStepsSubmit,
  validateStepsUpdate
}
