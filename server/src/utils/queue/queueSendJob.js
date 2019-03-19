import config from 'config';
import AWS from 'aws-sdk';
import randomstring from 'randomstring';
import request from 'request';

const env = config.get('env');
const { region, queueUrl } = config.get('aws');

export default (jobName, payload, messageGroupId = null) => {
  return new Promise((resolve, reject) => {
    if (typeof jobName !== 'string') {
      return reject('queueAddJob first parameter must be jobName string');
    }

    if (env !== 'dev') {
      const sqs = new AWS.SQS({ region });
      const MessageBody = JSON.stringify({
        job_name: jobName,
        payload
      });
      const sqsParams = {
        MessageBody,
        QueueUrl: queueUrl,
        MessageGroupId: messageGroupId || randomstring.generate(),
        // T
        // That's a hack right now. We should review all the event and see which one are really for FIFO
        // and which one are for regular queue and split them.
        // Which one should be deduplicated and which one should not in interval of 5 minutes
        MessageDeduplicationId: randomstring.generate()
      };

      sqs.sendMessage(sqsParams, (err, data) => {
        if (err) {
          throw err;
        }
        resolve();
      });
    } else {
      console.log(jobName);
      resolve(); // Resolve before calling queue, to fix the orde
      request.post({
        url: `http://localhost:6000/process`,
        method: 'POST',
        json: {
          job_name: jobName,
          payload
        }
      });
    }
  });
};
