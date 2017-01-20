import config from 'config';
import AWS from 'aws-sdk';
import hash from 'object-hash';
import {
  string,
  object,
  arrayOf,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import {
  dbNotificationsMarkAsSeen,
} from './db_utils/notifications';

// const env = process.env.NODE_ENV;
const {
  accessKeyId,
  secretAccessKey,
  queueHost,
} = config.get('amazonQueue');

const notificationsMarkAsSeen = valLocals('notificationsMarkAsSeen', {
  notification_ids: arrayOf(string).require(),
}, (req, res, next) => {
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
});

const notificationsPushToQueue = valLocals('notificationsPushToQueue', {
  queueMessage: object.require(),
  messageGroupId: string.require(),
}, (req, res, next) => {
  const {
    queueMessage,
    messageGroupId,
  } = res.locals;

  const message = queueMessage;
  const messageDeduplicationId = hash({ message });

  AWS.config.update({ accessKeyId, secretAccessKey });

  const sqs = new AWS.SQS({ region: 'us-west-2' });
  const payload = { payload: message };
  const sqsParams = {
    MessageBody: JSON.stringify(payload),
    QueueUrl: queueHost,
    MessageGroupId: messageGroupId,
    MessageDeduplicationId: messageDeduplicationId,
  };

  console.log(sqsParams);
  sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      console.log('AMAZON QUEUE ERR', err);
    }
  });
  // T
  // Leaving this here because it is easier to test with local queue when
  // adding new notifications

  // request.post({
  //   url: `${queueHost}/process`,
  //   method: 'POST',
  //   json: payload,
  // }, (error) => {
  //   if (error) {
  //     console.log(error, 'Error pushing to queue!');
  //   }
  // });

  return next();
});

export {
  notificationsMarkAsSeen,
  notificationsPushToQueue,
};
