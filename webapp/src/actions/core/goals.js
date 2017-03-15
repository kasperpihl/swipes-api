import * as a from 'actions';
import { valAction } from 'classes/utils';

import {
  string,
} from 'valjs';

export const create = valAction('goals.create', [
  string.min(1).max(155).require(),
], title => (d, getState) => d(a.api.request('goals.create', {
  goal: {
    title,
  },
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
})),
);
