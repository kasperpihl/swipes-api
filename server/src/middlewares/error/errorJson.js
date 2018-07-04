export default (err, req, res, next) => {
  res.status(400).send({ ok: false, error: 'Invalid json.' });
};