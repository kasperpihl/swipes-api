import { addMixin } from 'swiss-react';

addMixin('font', (fz = null, lh = null, fw = null) => ({
  fontSize: fz || 'initial',
  lineHeight: isNaN(lh) ? parseInt(lh) / parseInt(fz) : '1',
  fontWeight: fw
}));
