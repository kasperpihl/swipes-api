export default (err, req, res, next) => {
  if (err) {
    // T_TODO log this one to cloud watch
    console.log(err);
    res.status(400).send({ error: 'Invalid json.' });
  } else {
    next();
  }
};