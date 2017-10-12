import * as ca from './';

export const signup = obj => ca.api.request('users.signup', { ...obj });
