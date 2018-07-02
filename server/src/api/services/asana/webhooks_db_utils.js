import r from 'rethinkdb';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const createWebhookReference = (user_id, accountId) => {
  const data = {
    user_id,
    account_id: accountId,
  };

  const q = r.table('asana_webhooks').insert(data);

  return dbRunQuery(q);
};
const updateWebhookReference = (webhookId, webhook) => {
  const q = r.table('asana_webhooks').get(webhookId).update({ webhook });

  dbRunQuery(q)
    .then(() => {
      console.log('Webhook reference updated!');
    })
    .catch((err) => {
      console.log('Error updating webhook reference', err);
    });
};
const updateWebhookReferenceSecret = (webhookId, secret) => {
  const q = r.table('asana_webhooks').get(webhookId).update({ secret });

  return dbRunQuery(q);
};
const getWebhookReference = (webhookId) => {
  const q = r.table('asana_webhooks').get(webhookId);

  return dbRunQuery(q);
};
const getWebhooksReferences = (user_id) => {
  const q = r.table('asana_webhooks').getAll(user_id, { index: 'user_id' });

  return dbRunQuery(q);
};
const deleteWebhooksRefereces = (user_id) => {
  const q = r.table('asana_webhooks').getAll(user_id, { index: 'user_id' }).delete();

  return dbRunQuery(q);
};

export {
  createWebhookReference,
  updateWebhookReference,
  updateWebhookReferenceSecret,
  getWebhookReference,
  getWebhooksReferences,
  deleteWebhooksRefereces,
};
