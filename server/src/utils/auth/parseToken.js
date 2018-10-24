import jwt from 'jwt-simple';
import config from 'config';

export default token => {
  // removing the sw. in the beggining of the token
  const tokenWithoutPrefix = token.replace(/^sw./g, '');

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
    console.log(err);
    return null;
  }
};
