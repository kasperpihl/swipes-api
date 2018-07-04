/*
  Example:

  const composer = new MiddlewareComposer(req.body, middleware1, middleware2);

  composer.run();
*/

class MiddlewareComposer {
  constructor(req, ...args) {
    this.req = req;
    this.stack = args;
    this.res = {};
    this.res.locals = Object.assign({}, req);
  }
  next(err) {
    const {
      req,
      res,
      next,
      stack,
    } = this;

    const boundNext = next.bind(this);
    let fn = stack.shift();

    if (!fn) {
      throw new Error('Reach the end of middleware stack!');
    }

    if (err) {
      while (fn.length !== 4) {
        fn = stack.shift();
      }

      return fn(err, req, res, boundNext);
    }

    return fn(req, res, boundNext);
  }
  run() {
    this.next();
  }
}

export default MiddlewareComposer;
