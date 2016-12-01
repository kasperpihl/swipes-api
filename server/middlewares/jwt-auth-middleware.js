import jwt from 'jwt-simple';
import config from 'config';

const restAuth = (req, res, next) => {
  const token = res.locals.token;

  if (token) {
    try {
      const decoded = jwt.decode(token, config.get('jwtTokenSecret'));
      const user_id = decoded.iss;

      res.locals.user_id = user_id;

      return next();
    } catch (err) {
      return res.status(200).json({ ok: false, err: 'not_authed' });
    }
  }

  return res.status(200).json({ ok: false, err: 'not_authed' });
};

export default restAuth;
