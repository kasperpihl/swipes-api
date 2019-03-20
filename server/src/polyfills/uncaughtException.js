import logger from 'src/utils/logger';
import config from 'config';
const env = config.get('env');

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', err => {
  if (env !== 'dev') {
    logger('error', err);
  }
  console.error(err);
  process.exit(1);
});
