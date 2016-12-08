class SwipesError extends Error {
  constructor(message, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'SwipesError';
    this.message = message;
    if (extra) this.extra = extra;
  }
}

export default SwipesError;
