import { addMixin } from 'swiss-react';

addMixin('svgColor', (getProp, fill=null, stroke=null) => ({
  fill: fill,
  stroke: stroke || fill,
}));
