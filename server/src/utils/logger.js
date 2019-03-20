import config from 'config';
import winston from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';

const env = config.get('env');
const { accessKeyId, secretAccessKey, region } = config.get('aws');
const logger = winston.createLogger();
export const setupLogger = type => {
  const logConfig = {
    logGroupName: `workspace-${env}`,
    logStreamName: type,
    createLogGroup: true,
    createLogStream: true,
    awsConfig: {
      accessKeyId,
      secretAccessKey,
      region
    },
    formatLog: item => {
      return `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`;
    }
  };

  // put a check for the dev
  logger.add(new CloudWatchTransport(logConfig));
};

logger.level = process.env.LOG_LEVEL || 'silly';

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  }
};

export default (...args) => {
  try {
    logger.log(...args);
  } catch (e) {
    console.log('logger error', e);
  }
};
