import config from 'config';
import AWS from 'aws-sdk';
import request from 'request';
import randomstring from 'randomstring';

const env = config.get('env');
const { region, queueUrl } = config.get('aws');

export default async function queueRunBatch(jobs) {
  if (!Array.isArray(jobs)) {
    jobs = [jobs];
  }
  if (env === 'dev') {
    const sqs = new AWS.SQS({ region });
    jobs = jobs.map(({ job_name, payload }) => ({
      Id: randomstring.generate(12),
      MessageBody: JSON.stringify({
        job_name: job_name,
        payload
      }),
      MessageGroupId: randomstring.generate(12),
      MessageDeduplicationId: randomstring.generate(12)
    }));

    do {
      const chunk = jobs.splice(0, 10);
      await sqs.sendMessageBatch(
        {
          Entries: chunk,
          QueueUrl: queueUrl
        },
        (err, data) => {
          console.log(err, data);
        }
      );
    } while (jobs.length > 0);
  } else {
    jobs.forEach(({ job_name, payload }) => {
      request.post({
        url: `http://localhost:6000/process`,
        method: 'POST',
        json: {
          job_name,
          payload
        }
      });
    });
  }
}
