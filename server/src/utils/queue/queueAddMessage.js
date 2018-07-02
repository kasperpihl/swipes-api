import config from 'config';
import AWS from 'aws-sdk';
import randomstring from 'randomstring';

const env = config.get('env');
const {
  accessKeyId,
  secretAccessKey,
  queueHost,
} = config.get('amazonQueue');


export default (options, payload) => {
  return new Promise((resolve, reject) => {
    if(typeof options !== 'object')
    if (env !== 'dev') {
      AWS.config.update({ accessKeyId, secretAccessKey });

      const sqs = new AWS.SQS({ region: 'us-west-2' });
      const MessageBody = JSON.stringify({ eventName, payload });
      const sqsParams = {
        MessageBody,
        QueueUrl: queueHost,
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
        url: `${queueHost}/process`,
        method: 'POST',
        json: { payload },
      });
    }
  })
}