import redisCreateClient from './redisCreateClient';

const publishClient = redisCreateClient();

export default async function redisPublish(channel, message) {
  if (typeof message !== 'object' || typeof message.type !== 'string') {
    throw Error(
      'redisPublish expects channel and message object ({ type, payload })'
    );
  }
  return new Promise((resolve, reject) => {
    publishClient.publish(
      channel,
      JSON.stringify(message),
      (err, listeners) => {
        if (err) {
          reject(err);
        } else {
          resolve(listeners);
        }
      }
    );
  });
}
