import { inherits } from 'util';

const SwipesError = (message, extra) => {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};

inherits(SwipesError, Error);

export default SwipesError;
