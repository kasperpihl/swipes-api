import config from 'config';
// import request from 'request';
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
  dbNotificationsMarkAsSeenIds,
} from './db_utils/notifications';

const {
  accessKeyId,
  secretAccessKey,
  queueHost,
} = config.get('amazonQueue');

const notificationsMarkAsSeenIds = valLocals('notificationsMarkAsSeenIds', {
  notification_ids: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    notification_ids,
  } = res.locals;

  const timestamp_now = new Date().toISOString();

  setLocals({
    last_marked: timestamp_now,
  });

  dbNotificationsMarkAsSeenIds({ notification_ids, timestamp_now })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const notificationsMarkAsSeenIdsHistoryUpdatedEventType = valLocals('notificationsMarkAsSeenIdsEventType', {
  queueMessage: object.require(),
}, (req, res, next, setLocals) => {
  const {
    queueMessage,
  } = res.locals;

  queueMessage.event_type = 'notifications_seen_ids_history_updated';

  setLocals({
    queueMessage,
  });

  return next();
});
const notificationsMarkAsSeenIdsQueueMessage = valLocals('notificationsMarkAsSeenIdsQueueMessage', {
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
    event_type: 'notifications_seen_ids',
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
  //   json: { payload: message },
  // }, (error) => {
  //   if (error) {
  //     console.log(error, 'Error pushing to queue!');
  //   }
  // });

  return next();
});

export {
  notificationsPushToQueue,
  notificationsMarkAsSeenIds,
  notificationsMarkAsSeenIdsQueueMessage,
  notificationsMarkAsSeenIdsHistoryUpdatedEventType,
};
