import config from 'config';
import AWS from 'aws-sdk';
import hash from 'object-hash';
import {
  string,
  object,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import {
  dbNotificationsMarkAsSeen,
} from './db_utils/notifications';

const {
  accessKeyId,
  secretAccessKey,
  queueHost,
} = config.get('amazonQueue');

const notificationsMarkAsSeen = valLocals('notificationsMarkAsSeen', {
  user_id: string.require(),
  timestamp: string.format('iso8601').require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    timestamp,
  } = res.locals;

  const timestamp_now = new Date().toISOString();

  setLocals({
    marked_at: timestamp,
    last_marked: timestamp_now,
  });

  dbNotificationsMarkAsSeen({ user_id, timestamp, timestamp_now })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const notificationsMarkAsSeenQueueMessage = valLocals('notificationsMarkAsSeenQueueMessage', {
  user_id: string.require(),
  marked_at: string.require(),
  last_marked: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    marked_at,
    last_marked,
  } = res.locals;
  const queueMessage = {
    user_id,
    marked_at,
    last_marked,
    event_type: 'notifications_seen',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
  });

  return next();
});
const notificationsPushToQueue = valLocals('notificationsPushToQueue', {
  queueMessage: object.as({
    user_id: string.require(),
    event_type: string.require(),
  }).require(),
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
  notificationsMarkAsSeenQueueMessage,
};
