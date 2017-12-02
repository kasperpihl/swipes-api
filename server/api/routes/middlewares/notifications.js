import config from 'config';
import request from 'request';
import AWS from 'aws-sdk';
import hash from 'object-hash';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  valLocals,
} from '../../utils';
import {
  dbNotificationsMarkAsSeen,
} from './db_utils/notifications';

const env = config.get('env');
const {
  accessKeyId,
  secretAccessKey,
  queueHost,
} = config.get('amazonQueue');

const notificationsMarkAsSeen = valLocals('notificationsMarkAsSeen', {
  notification_ids: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    notification_ids,
  } = res.locals;

  const timestamp_now = new Date().toISOString();

  setLocals({
    last_marked: timestamp_now,
  });

  dbNotificationsMarkAsSeen({ notification_ids, timestamp_now })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const notificationsMarkAsSeenQueueMessage = valLocals('notificationsMarkAsSeenQueueMessage', {
  user_id: string.require(),
  notification_ids: array.of(string).require(),
  last_marked: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    notification_ids,
    last_marked,
  } = res.locals;
  const queueMessage = {
    user_id,
    notification_ids,
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
    user_id: string,
    event_type: string.require(),
  }),
  messageGroupId: string,
}, (req, res, next, setLocals) => {
  const {
    queueMessage,
    messageGroupId,
  } = res.locals;

  console.log(queueMessage);
  console.log(messageGroupId);

  if (!queueMessage || !messageGroupId) {
    return next();
  }

  const message = queueMessage;
  const messageDeduplicationId = hash({ message });

  if (env !== 'dev') {
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

      setLocals({
        queueMessage: null,
        messageGroupId: null,
      });

      return next();
    });
  } else {
    request.post({
      url: `${queueHost}/process`,
      method: 'POST',
      json: { payload: message },
    }, (error) => {
      if (error) {
        console.log(error, 'Error pushing to queue!');
      }

      setLocals({
        queueMessage: null,
        messageGroupId: null,
      });

      return next();
    });
  }
});

export {
  notificationsPushToQueue,
  notificationsMarkAsSeen,
  notificationsMarkAsSeenQueueMessage,
};
