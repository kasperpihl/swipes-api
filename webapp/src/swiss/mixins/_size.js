import { addMixin } from 'swiss-react';

addMixin('size', (getProp, width=null, height=null) => ({
  width: width || 'auto',
  height: height || width || 'auto',
}));
