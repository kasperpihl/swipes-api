import { addMixin } from 'react-swiss';

addMixin('truncateString', () => ({
  'white-space': 'nowrap',
  'overflow': 'hidden',
  'text-overflow': 'ellipsis',
}));
