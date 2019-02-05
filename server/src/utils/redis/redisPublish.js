import redisCreateClient from './redisCreateClient';

const publishClient = redisCreateClient();

export default async function redisPublish(channel, payload) {
  return new Promise((resolve, reject) => {
    publishClient.publish(channel, payload, (err, listeners) => {
      if (err) {
        reject(err);
      } else {
        resolve(listeners);
      }
    });
  });
}
