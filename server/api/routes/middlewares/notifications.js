import config from 'config';
import request from 'request';
import AWS from 'aws-sdk';
import {
  dbNotificationsMarkAsSeen,
} from './db_utils/notifications';

const env = process.env.NODE_ENV;
const queueHost = config.get('queueHost');
const {
  accessKeyId,
  secretAccessKey,
} = config.get('amazonQueue');

const notificationsMarkAsSeen = (req, res, next) => {
  const {
    notification_ids,
  } = res.locals;

  dbNotificationsMarkAsSeen({ notification_ids })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

const notificationsPushToQueue = (req, res, next) => {
  const {
    user_id,
    goal,
    eventType,
  } = res.locals;

  const goal_id = goal.id;
  const message = {
    user_id,
    goal_id,
    event_type: eventType,
  };

  if (env === 'staging') {
    AWS.config.update({ accessKeyId, secretAccessKey });

    const sqs = new AWS.SQS({ region: 'us-west-oregon' });
    const payload = { payload: message };
    const sqsParams = {
      MessageBody: JSON.stringify(payload),
      QueueUrl: 'QUEUE_URL',
    };

    sqs.sendMessage(sqsParams, (err, data) => {
      if (err) {
        console.log('AMAZON QUEUE ERR', err);
      }
    });
  } else {
    request.post({
      url: `${queueHost}/process`,
      method: 'POST',
      json: message,
    }, (error) => {
      if (error) {
        console.log(error, 'Error pushing to queue!');
      }
    });
  }

  return next();
};

export {
  notificationsMarkAsSeen,
  notificationsPushToQueue,
};
