import config from 'config';
import winston from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';

const env = config.get('env');
const cloudWatchConfig = config.get('awsCloudWatch');
const logger = new winston.Logger();

if (env === 'dev') {
  logger.add(winston.transports.Console, {
    timestamp: true,
    colorize: true,
  });
}

const logConfig = {
  logGroupName: 'workspace-log-group',
  logStreamName: env,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: {
    accessKeyId: cloudWatchConfig.accessKey,
    secretAccessKey: cloudWatchConfig.secretKey,
    region: cloudWatchConfig.region,
  },
  formatLog: (item) => {
    return `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`;
  },
};

// put a check for the dev
if (env !== 'dev') {
  logger.add(CloudWatchTransport, logConfig);
}

logger.level = process.env.LOG_LEVEL || 'silly';

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  },
};

module.exports = logger;
