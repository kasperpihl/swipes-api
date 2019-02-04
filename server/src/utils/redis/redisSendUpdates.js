import { object, array, string } from 'valjs';
import redisPubClient from './redisPubClient';
import { query } from 'src/utils/db/db';

const updateSchema = object.as({
  type: any
    .of(
      'discussion_comment',
      'discussion',
      'me',
      'note',
      'organization',
      'organization_user',
      'project'
    )
    .require(),
  parentId: string.require(),
  itemId: string,
  receivers: array.of(string).require(),
  data: object
});

export default async function redisSendUpdates(updates) {
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
    const { receivers, ...rest } = update;
    receivers.forEach(rec => {
      redisPubClient.publish(rec, JSON.stringify(rest));
    });
  });
}
