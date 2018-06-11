import { addMixin } from 'swiss-react';

addMixin('styleIfNumberOfElements', (getProp, target='oneoftype' ,number=1, content={}) => {
  if (number === 1) {
    return {
      [`.${target}:first-of-type:nth-last-of-type(1)`]: content,
    }
  } else {
    return {
      [`.${target}:first-of-type:nth-last-of-type(${number}), .${target}:first-of-type:nth-last-of-type(${number}) ~ .${target},`]: content,
    }
  }
});