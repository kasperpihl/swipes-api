import { addMixin } from 'swiss-react';

addMixin('border', function border(size, color, side) {
  if (side) {
    if (typeof side === 'string') {
      const uppercaseSide = side.charAt(0).toUpperCase() + side.slice(1);

      return {
        [`border${uppercaseSide}Width`]: size,
        [`border${uppercaseSide}Color`]: color,
      };
    }
    return {
      borderWidth: size,
      borderColor: color,
      borderRadius: side,
    };
  }

  return {
    borderWidth: size,
    borderColor: color,
  };
});