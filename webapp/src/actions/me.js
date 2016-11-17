import { request } from './api'

const disconnectService = (account_id) => {
  return request('users.serviceDisconnect', { account_id });
}

const handleOAuthSuccess = (serviceName, query) => {
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }

  const options = {
    query,
    service_name: serviceName
  };

  return request('services.authsuccess', options);
}

export {
  disconnectService,
  handleOAuthSuccess
}
