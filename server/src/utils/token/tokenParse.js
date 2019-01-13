import jwt from 'jwt-simple';
import config from 'config';

export default (prefix, token) => {
  const tokenWithoutPrefix = token.substr(prefix.length + 1);

  try {
    const tokenContent = jwt.decode(
      tokenWithoutPrefix,
      config.get('jwtTokenSecret')
    );

    return {
      token,
      tokenContent
    };
  } catch (err) {
    return null;
  }
};
