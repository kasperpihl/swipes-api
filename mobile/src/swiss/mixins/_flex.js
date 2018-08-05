import { addMixin } from 'swiss-react';

addMixin('flex', function flex(props, direction, directionHorizontal, directionVertical) {
  let flexContainer = {};

  if (direction === 'center') {
    flexContainer = Object.assign(flexContainer, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' });
  }

  if (direction === 'row') {
    flexContainer = Object.assign(flexContainer, { flexDirection: direction });

    switch (directionHorizontal) {
      case 'flex-start':
      case 'left': flexContainer = Object.assign(flexContainer, { justifyContent: 'flex-start' }); break;
      case 'center': flexContainer = Object.assign(flexContainer, { justifyContent: 'center' }); break;
      case 'flex-end':
      case 'right': flexContainer = Object.assign(flexContainer, { justifyContent: 'flex-end' }); break;
      case 'space-between':
      case 'between': flexContainer = Object.assign(flexContainer, { justifyContent: 'space-between' }); break;
      case 'space-around':
      case 'around': flexContainer = Object.assign(flexContainer, { justifyContent: 'space-around' }); break;
    }

    switch (directionVertical) {
      case 'flex-start':
      case 'top': flexContainer = Object.assign(flexContainer, { alignItems: 'flex-start' }); break;
      case 'center': flexContainer = Object.assign(flexContainer, { alignItems: 'center' }); break;
      case 'stretch': flexContainer = Object.assign(flexContainer, { alignItems: 'stretch' }); break;
      case 'flex-end':
      case 'bottom': flexContainer = Object.assign(flexContainer, { alignItems: 'flex-end' }); break;
    }
  }

  if (direction === 'column') {
    flexContainer = Object.assign(flexContainer, { flexDirection: direction });

    switch (directionHorizontal) {
      case 'flex-start':
      case 'top': flexContainer = Object.assign(flexContainer, { alignItems: 'flex-start' }); break;
      case 'center': flexContainer = Object.assign(flexContainer, { alignItems: 'center' }); break;
      case 'stretch': flexContainer = Object.assign(flexContainer, { alignItems: 'stretch' }); break;
      case 'flex-end':
      case 'bottom': flexContainer = Object.assign(flexContainer, { alignItems: 'flex-end' }); break;
    }

    switch (directionVertical) {
      case 'flex-start':
      case 'left': flexContainer = Object.assign(flexContainer, { justifyContent: 'flex-start' }); break;
      case 'center': flexContainer = Object.assign(flexContainer, { justifyContent: 'center' }); break;
      case 'flex-end':
      case 'right': flexContainer = Object.assign(flexContainer, { justifyContent: 'flex-end' }); break;
      case 'space-between':
      case 'between': flexContainer = Object.assign(flexContainer, { justifyContent: 'space-between' }); break;
      case 'space-around':
      case 'around': flexContainer = Object.assign(flexContainer, { justifyContent: 'space-around' }); break;
    }
  }

  return flexContainer;
});