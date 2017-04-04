import { request } from './api';

const disconnectService = accountId => request('users.serviceDisconnect', { account_id: accountId });

const handleOAuthSuccess = (serviceName, query) => {
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }

  const options = {
    query,
    service_name: serviceName,
  };

  return request('services.authsuccess', options);
};

export {
  disconnectService,
  handleOAuthSuccess,
};
