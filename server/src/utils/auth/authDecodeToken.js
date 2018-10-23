import jwt from 'jwt-simple';
import config from 'config';

export default token => {
  const jwtHead = config.get('jwtTokenHead');
  // removing the sw. in the beggining of the token
  const tokenWithoutSw = token
    .split('.')
    .splice(1, 2)
    .join('.');
  const constructedToken = `${jwtHead}.${tokenWithoutSw}`;
  const dbToken = `sw.${constructedToken}`;

  try {
    const content = jwt.decode(constructedToken, config.get('jwtTokenSecret'));

    return {
      constructedToken,
      dbToken,
      content
    };
  } catch (err) {
    return null;
  }
};
