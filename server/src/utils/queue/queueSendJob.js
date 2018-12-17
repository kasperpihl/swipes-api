import config from 'config';
import AWS from 'aws-sdk';
import randomstring from 'randomstring';
import request from 'request';

const env = config.get('env');
const { accessKeyId, secretAccessKey, region, queueUrl } = config.get('aws');

export default (options, payload, messageGroupId = null) => {
  return new Promise((resolve, reject) => {
    if (typeof options !== 'object') {
      options = { eventName: options };
    }
    if (typeof options.eventName !== 'string') {
      return reject(
        'queueAddJob first parameter must be eventName string or options { eventName }'
      );
    }
    if (env !== 'dev') {
      AWS.config.update({ accessKeyId, secretAccessKey });

      const sqs = new AWS.SQS({ region });
      const MessageBody = JSON.stringify({
        eventName: options.eventName,
        payload,
      });
      const sqsParams = {
        MessageBody,
        QueueUrl: queueUrl,
        MessageGroupId: messageGroupId,
        // T
        // That's a hack right now. We should review all the event and see which one are really for FIFO
        // and which one are for regular queue and split them.
        // Which one should be deduplicated and which one should not in interval of 5 minutes
        MessageDeduplicationId: randomstring.generate(),
      };

      sqs.sendMessage(sqsParams, (err, data) => {
        if (err) {
          console.log('AMAZON QUEUE ERR', err);
        }
        resolve();
      });
    } else {
      resolve(); // Resolve before calling queue, to fix the orde
      request.post({
        url: `http://localhost:6000/process`,
        method: 'POST',
        json: {
          eventName: options.eventName,
          payload,
        },
      });
    }
  });
};
