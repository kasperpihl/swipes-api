export function font() {

}

export function padding() {

}

export function size() {
  
}

export function flex(direction, directionHorizontal, directionVertical) {
  let flexContainer = {};

  if (direction === 'row') {
    flexContainer = Object.assign(flexContainer, {flexDirection: direction})
    
    switch (directionHorizontal) {
      case 'left': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {justifyContent: 'center'}); break;
      case 'right': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-end'}); break;
      case 'between': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-between'}); break;
      case 'around': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-around'}); break;
    };
    
    switch (directionVertical) {
      case 'top': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {alignItems: 'center'}); break;
      case 'bottom': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-end'}); break;
    };
  }
  
  if (direction === 'column') {
    flexContainer = Object.assign(flexContainer, {flexDirection: direction})
    
    switch (directionHorizontal) {
      case 'top': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {alignItems: 'center'}); break;
      case 'bottom': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-end'}); break;
    };
    
    switch (directionVertical) {
      case 'left': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {justifyContent: 'center'}); break;
      case 'right': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-end'}); break;
      case 'between': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-between'}); break;
      case 'around': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-around'}); break;
    };
  }
  
  return flexContainer;
}