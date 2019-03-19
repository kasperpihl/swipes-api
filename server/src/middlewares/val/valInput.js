import valjs, { object } from 'valjs';

export default function valInput(schema) {
  return async (req, res, next) => {
    if (typeof schema !== 'object') return next();
    // let's validate the params #inception! :D
    let error = valjs(
      { schema },
      object.as({
        schema: object.require()
      }),
      true
    );

    const params = Object.assign({}, req.params, req.query, req.body);
    if (!error) {
      error = valjs(params, object.as(schema));
    }

    if (error) {
      throw Error(`Validation error`)
        .info({
          validationError: error,
          expectedInput: object.as(schema).toString()
        })
        .toClient();
    }

    res.locals.input = params;
    return next();
  };
}
