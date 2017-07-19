import * as ca from './';

export const create = (link) => (d, getState) => d(ca.api.request('links.create', {
  link,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
}));
