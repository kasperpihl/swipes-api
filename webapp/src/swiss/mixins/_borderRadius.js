import { addMixin } from 'swiss-react';

addMixin('borderRadius', (getProp, ...args) => {
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
});
