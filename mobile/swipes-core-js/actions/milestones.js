import {
  string,
} from 'valjs';

import * as a from './';
import { valAction } from '../classes/utils';

export const create = valAction('milestones.create', [
  string.min(1).max(155).require(),
], (title) => (d, getState) => {
  d(a.onboarding.complete('create-milestone'));
  return d(a.api.request('milestones.create', {
    title,
    organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
  }));
});
