import config from 'config';
import AWS from 'aws-sdk';
import request from 'request';
import randomstring from 'randomstring';

const env = config.get('env');
const { region, queueUrl } = config.get('aws');

export default function queueRunBatch(jobs) {
  if (!Array.isArray(jobs)) {
    jobs = [jobs];
  }
  if (jobs.length > 10) {
    throw Error('queueRunBatch: cannot add more than 10 jobs at a time');
  }
  return new Promise((resolve, reject) => {
    if (env !== 'dev') {
      const sqs = new AWS.SQS({ region });
      jobs = jobs.map(({ job_name, payload }) => ({
        Id: randomstring.generate(12),
        MessageBody: JSON.stringify({
          job_name,
          payload
        }),
        MessageGroupId: randomstring.generate(12),
        MessageDeduplicationId: randomstring.generate(12)
      }));

      sqs.sendMessageBatch(
        {
          Entries: jobs,
          QueueUrl: queueUrl
        },
        err => {
          if (err) reject(err);
          else resolve();
        }
      );
    } else {
      resolve();
      jobs.forEach(({ job_name, payload }) => {
        console.log(job_name, payload);
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
  });
}
