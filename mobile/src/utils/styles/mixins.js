import * as colors from './colors';

export function font(fontSize, color, lineHeight, fontWeight) {
  if (typeof lineHeight === 'string' && !fontWeight) {
    return {
      fontSize,
      color,
      fontWeight: lineHeight,
      includeFontPadding: false,
    };
  } 

  return {
      fontSize,
      color,
      lineHeight,
      fontWeight, 
      includeFontPadding: false,
    };
}

export function borderRadius(...args) {
  const amountOfArguments = args.length;

  if (amountOfArguments === 1) {
    return {
      borderRadius: args[0],
    }
  } else if (amountOfArguments === 4) {
    return {
      borderTopLeftRadius: args[0],
      borderTopRightRadius: args[1],
      borderBottomRightRadius: args[2],
      borderBottomLeftRadius: args[3],
    }
  }
}

export function border(size, color, side) {

  if (side) {
    
    if (typeof side === 'string') {
      const uppercaseSide = side.charAt(0).toUpperCase() + side.slice(1);

      return {
        [`border${uppercaseSide}Width`]: size,
        [`border${uppercaseSide}Color`]: color,
      }
    } else {
      return {
        borderWidth: size,
        borderColor: color,
        borderRadius: side,
      }
    }

  }

  return {
    borderWidth: size,
    borderColor: color,
  }
}

export function padding(...args) {
  const amountOfArguments = args.length;

  if (!amountOfArguments) {
    return {
      paddingHorizontal: 0,
      paddingVertical: 0,
    }
  }
  
  if (amountOfArguments === 1) {
    return {
      paddingHorizontal: args[0],
      paddingVertical: args[0],
    }
  } else if (amountOfArguments === 2) {
    return {
      paddingVertical: args[0],
      paddingHorizontal: args[1],
    }
  } else if (amountOfArguments === 3) {
    return {
      paddingTop: args[0],
      paddingRight: args[1],
      paddingBottom: args[2],
      paddingLeft: 0,
    }
  } else if (amountOfArguments === 4) {
    return {
      paddingTop: args[0],
      paddingRight: args[1],
      paddingBottom: args[2],
      paddingLeft: args[3],
    }
  } 
};

export function margin(...args) {
  const amountOfArguments = args.length;
  
  if (!amountOfArguments) {
    return {
      marginHorizontal: 0,
      marginVertical: 0,
    }
  }

  if (amountOfArguments === 1) {
    return {
      marginHorizontal: args[0],
      marginVertical: args[0],
    }
  } else if (amountOfArguments === 2) {
    return {
      marginVertical: args[0],
      marginHorizontal: args[1],
    }
  } else if (amountOfArguments === 3) {
    return {
      marginTop: args[0],
      marginRight: args[1],
      marginBottom: args[2],
      marginLeft: 0,
    }
  } else if (amountOfArguments === 4) {
    return {
      marginTop: args[0],
      marginRight: args[1],
      marginBottom: args[2],
      marginLeft: args[3],
    }
  }
};

export function size(width, height) {
  if (width === 1) {
    return { flex: 1 };
  }

  if (width && !height) {
    return {
      width: width,
      height: width
    }
  }

  if (width && height) {
    return {
      width: width,
      height: height
    }
  }
}

export function flex(direction, directionHorizontal, directionVertical) {
  let flexContainer = {};

  if (direction === 'center') {
    flexContainer = Object.assign(flexContainer, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' });
  }

  if (direction === 'row') {
    flexContainer = Object.assign(flexContainer, {flexDirection: direction})
    
    switch (directionHorizontal) {
      case 'flex-start':
      case 'left': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {justifyContent: 'center'}); break;
      case 'flex-end':
      case 'right': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-end'}); break;
      case 'space-between':
      case 'between': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-between'}); break;
      case 'space-around':
      case 'around': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-around'}); break;
    };
    
    switch (directionVertical) {
      case 'flex-start':
      case 'top': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {alignItems: 'center'}); break;
      case 'stretch': flexContainer = Object.assign(flexContainer, {alignItems: 'stretch'}); break;
      case 'flex-end':
      case 'bottom': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-end'}); break;
    };
  }
  
  if (direction === 'column') {
    flexContainer = Object.assign(flexContainer, {flexDirection: direction})
    
    switch (directionHorizontal) {
      case 'flex-start':
      case 'top': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {alignItems: 'center'}); break;
      case 'stretch': flexContainer = Object.assign(flexContainer, {alignItems: 'stretch'}); break;
      case 'flex-end':
      case 'bottom': flexContainer = Object.assign(flexContainer, {alignItems: 'flex-end'}); break;
    };
    
    switch (directionVertical) {
      case 'flex-start':
      case 'left': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-start'}); break;
      case 'center': flexContainer = Object.assign(flexContainer, {justifyContent: 'center'}); break;
      case 'flex-end':
      case 'right': flexContainer = Object.assign(flexContainer, {justifyContent: 'flex-end'}); break;
      case 'space-between':
      case 'between': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-between'}); break;
      case 'space-around':
      case 'around': flexContainer = Object.assign(flexContainer, {justifyContent: 'space-around'}); break;
    };
  }
  
  return flexContainer;
}
