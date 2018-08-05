import { addMixin } from 'swiss-react';

addMixin('size', function size(props, width, height) {
  if (width === 1) {
    return { flex: 1 };
  }

  if (width && !height) {
    return {
      width,
      height: width,
    };
  }

  if (width && height) {
    return {
      width,
      height,
    };
  }
})