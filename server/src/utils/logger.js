import config from 'config';
import winston from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';

const env = config.get('env');
const { accessKeyId, secretAccessKey, region } = config.get('aws');
const logger = new winston.Logger();

const logConfig = {
  logGroupName: 'workspace-log-group',
  logStreamName: env,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: {
    accessKeyId,
    secretAccessKey,
    region,
  },
  formatLog: item => {
    return `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`;
  },
};

// put a check for the dev
logger.add(CloudWatchTransport, logConfig);
logger.level = process.env.LOG_LEVEL || 'silly';

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  },
};

export default logger;
