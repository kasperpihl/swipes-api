import logger from 'src/utils/logger';

// Log out any uncaught exceptions, but making sure to kill the process after!
process.on('uncaughtException', (err) => {
  if (env !== 'dev') {
    logger.log('error', err);
  } else {
    console.error(err);
  }
  process.exit(1);
});