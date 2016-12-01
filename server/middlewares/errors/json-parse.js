const handleJsonError = (err, req, res, next) => {
  if (err) {
    res.status(400).send({ error: 'Invalid json.' });
  } else {
    next();
  }
};

export default handleJsonError;
