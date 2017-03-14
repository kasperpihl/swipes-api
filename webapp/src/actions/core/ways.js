import * as a from 'actions';
import { valAction } from 'classes/utils';

import {
  object,
  string,
} from 'valjs';

export const create = valAction('ways.create', [
  string.min(1).max(155).require(),
  object.require(),
], (title, goal) => (d, getState) => d(a.api.request('ways.create', {
  title,
  goal,
  organization_id: getState().getIn(['me', 'organizations', 0, 'id']),
})),
);

export const archive = valAction('ways.archive', [
  string.require(),
], id => d => d(a.api.request('ways.archive', { id })));
