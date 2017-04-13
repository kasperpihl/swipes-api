import { request } from './api';

export const disconnectService = accountId => request('users.serviceDisconnect', { account_id: accountId });

export const handleOAuthSuccess = (serviceName, query) => {
  if (typeof query === 'string') {
    query = JSON.parse(query);
  }

  const options = {
    query,
    service_name: serviceName,
  };

  return request('services.authsuccess', options);
};

export const updateSettings = (s) => request('me.updateSettings', { settings: s });

export const updateProfile = (p) => request('me.updateProfile', { profile: p });
