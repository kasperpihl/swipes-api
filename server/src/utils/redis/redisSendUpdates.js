import { object, any } from 'valjs';
import redisPubClient from './redisPubClient';

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

export default function redisSendUpdates(receivers, updates) {
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
  receivers.forEach(rec => {
    redisPubClient.publish(
      rec,
      JSON.stringify({ type: 'update', payload: { updates } })
    );
  });
}
