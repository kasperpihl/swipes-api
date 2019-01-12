import jwt from 'jwt-simple';
import config from 'config';
import idGenerate from 'src/utils/idGenerate';

export default tokenContent => {
  const content = Object.assign({}, tokenContent, {
    r: idGenerate('', 5)
  });
  const token = jwt.encode(content, config.get('jwtTokenSecret'));
  const prefix = 'sw.';

  return `${prefix}${token}`;
};
