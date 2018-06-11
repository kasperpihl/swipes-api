import { addMixin } from 'swiss-react';

addMixin('truncateString', () => ({
  'white-space': 'nowrap',
  'overflow': 'hidden',
  'text-overflow': 'ellipsis',
}));
