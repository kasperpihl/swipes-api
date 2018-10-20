import jwt from 'jwt-simple';
import config from 'config';
import idGenerate from 'src/utils/idGenerate';

export default tokenContent => {
  const content = Object.assign({}, tokenContent, {
    r: idGenerate('', 3),
  });
  const token = jwt.encode(content, config.get('jwtTokenSecret'));
  const shortToken = token
    .split('.')
    .splice(1, 2)
    .join('.');
  const prefix = 'sw.';

  return {
    token: `${prefix}${token}`,
    shortToken: `${prefix}${shortToken}`,
  };
};
