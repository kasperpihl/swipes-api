import { request } from './api'

const disconnectService = (id) => {
  return request('users.serviceDisconnect', {id});
}

const handleOAuthSuccess = (serviceName, query) => {
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }

  const options = {
    service: serviceName,
    data: query
  };

  return request('services.authsuccess', options);
}

export {
  disconnectService,
  handleOAuthSuccess
}
