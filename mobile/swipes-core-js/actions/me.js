import { request } from './api';

export const disconnectService = aId => request('users.serviceDisconnect', { account_id: aId });

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

export const updateSettings = s => request('me.updateSettings', { settings: s });

export const updateProfile = p => request('me.updateProfile', { profile: p });

export const togglePinGoal = gId => (d, getState) => {
  let pins = getState().getIn(['me', 'settings', 'pinned_goals']);
  if(pins.contains(gId)){
    pins = pins.filter((p => p !== gId));
  } else {
    pins = pins.push(gId);
  }
  return d(updateSettings({pinned_goals: pins.toJS()}));
}
