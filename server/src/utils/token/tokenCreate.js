import jwt from 'jwt-simple';
import config from 'config';

export default (prefix, tokenContent) => {
  const token = jwt.encode(tokenContent, config.get('jwtTokenSecret'));

  return `${prefix}.${token}`;
};
