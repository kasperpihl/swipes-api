import valjs, {
  object,
} from 'valjs';

export default function valInput(schema){
  return (req, res, next) => {
    // let's validate the params #inception! :D
    let error = valjs({ schema }, object.as({
      schema: object.require(),
    }), true);

    const params = Object.assign({}, req.params, req.query, req.body, req.file);
    if (!error) {
      error = valjs(params, object.as(schema));
    }

    if (error) {
      return next(new Error(`${req.route.path} valBody: ${error}`).info({
        expectedInput: object.as(schema).toString()
      }));
    }

    res.locals.input = params;
    return next();
  };
} 