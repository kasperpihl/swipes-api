import { request } from './api';
export const init = () => (d, getState) => {
  const state = getState();
  const forceFullFetch = state.getIn(['connection', 'forceFullFetch']);
  const withoutNotes = state.getIn(['globals', 'withoutNotes']);
  const lastConnect = state.getIn(['connection', 'lastConnect']);
  const me = state.get('me');

  const options = {
    without_notes: withoutNotes,
  };

  if(!forceFullFetch && lastConnect) {
    options.timestamp = lastConnect;
  }

  return d(request('init', options));
}

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
  const token = getState().connection.get('token');
  const formData = new FormData();
  formData.append('token', token);
  formData.append('photo', photo);
  return d(request({
    command: 'me.uploadProfilePhoto',
    formData: true,
  }, {
    photo,
  }));
}

export const updateSettings = s => request('me.updateSettings', { settings: s });

export const updateProfile = p => request('me.updateProfile', { profile: p });

export const togglePinGoal = gId => (d, getState) => {
  let stars = getState().me.getIn(['settings', 'starred_goals']);
  if(stars.contains(gId)){
    stars = stars.filter((p => p !== gId));
  } else {
    stars = stars.push(gId);
  }
  return d(updateSettings({starred_goals: stars.toJS()}));
}
