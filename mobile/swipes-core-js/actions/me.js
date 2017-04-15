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

export const uploadProfilePhoto = photo => (d, getState) => {
  const token = getState().getIn(['connection', 'token']);
  const formData = new FormData();
  formData.append('token', token);
  formData.append('photo', photo);
  return fetch(`${window.__API_URL__}/v1/me.uploadProfilePhoto`, {
    method: 'POST',
    body: formData
  });
}

export const updateSettings = s => request('me.updateSettings', { settings: s });

export const updateProfile = p => request('me.updateProfile', { profile: p });

export const togglePinGoal = gId => (d, getState) => {
  let stars = getState().getIn(['me', 'settings', 'starred_goals']);
  if(stars.contains(gId)){
    stars = stars.filter((p => p !== gId));
  } else {
    stars = stars.push(gId);
  }
  return d(updateSettings({starred_goals: stars.toJS()}));
}
