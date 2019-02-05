import { object, any } from 'valjs';
import redisPublish from './redisPublish';

const updateSchema = object.as({
  type: any
    .of(
      'comment',
      'discussion',
      'me',
      'note',
      'organization',
      'organization_user',
      'project'
    )
    .require(),
  data: object
});

export default async function redisSendUpdates(receivers, updates) {
  if (!Array.isArray(updates)) {
    updates = [updates];
  }
  updates.forEach(update => {
    const validationError = updateSchema.test(update);
    if (validationError) {
      throw Error('Send updates validation error').info({
        validationError
      });
    }
  });
  receivers.forEach(async rec => {
    await redisPublish(
      rec,
      JSON.stringify({ type: 'update', payload: { updates } })
    );
  });
}
