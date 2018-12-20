import { addMixin } from 'swiss-react';

addMixin('flex', (direction, horizontal, vertical) => {
  let flex = {};
  flex.display = 'flex';

  if (direction === 'center') {
    flex.justifyContent = 'center';
    flex.alignItems = 'center';
  }

  if (direction === 'row') {
    flex.flexDirection = direction;

    switch (horizontal) {
      case 'left':
      case 'flex-start':
        flex.justifyContent = 'flex-start';
        break;
      case 'center':
        flex.justifyContent = 'center';
        break;
      case 'right':
      case 'flex-end':
        flex.justifyContent = 'flex-end';
        break;
      case 'between':
      case 'space-between':
        flex.justifyContent = 'space-between';
        break;
      case 'around':
      case 'space-around':
        flex.justifyContent = 'space-around';
        break;
    }

    switch (vertical) {
      case 'top':
      case 'flex-start':
        flex.alignItems = 'flex-start';
        break;
      case 'center':
        flex.alignItems = 'center';
        break;
      case 'bottom':
      case 'flex-end':
        flex.alignItems = 'flex-end';
        break;
      case 'stretch':
        flex.alignItems = 'stretch';
        break;
    }
  }

  if (direction === 'column') {
    flex.flexDirection = direction;

    switch (horizontal) {
      case 'left':
      case 'flex-start':
        flex.alignItems = 'flex-start';
        break;
      case 'center':
        flex.alignItems = 'center';
        break;
      case 'right':
      case 'flex-end':
        flex.alignItems = 'flex-end';
        break;
    }

    switch (vertical) {
      case 'top':
      case 'flex-start':
        flex.justifyContent = 'flex-start';
        break;
      case 'center':
        flex.justifyContent = 'center';
        break;
      case 'bottom':
      case 'flex-end':
        flex.justifyContent = 'flex-end';
        break;
      case 'between':
      case 'space-between':
        flex.justifyContent = 'space-between';
        break;
      case 'around':
      case 'space-around':
        flex.justifyContent = 'space-around';
        break;
    }
  }

  return { ...flex };
});
