import { addMixin } from 'swiss-react';

addMixin('padding', (props, ...args) => {
  const amountOfArguments = args.length;
  if (!amountOfArguments) {
    return {
      paddingHorizontal: 0,
      paddingVertical: 0,
    };
  }

  if (amountOfArguments === 1) {
    return {
      paddingHorizontal: args[0],
      paddingVertical: args[0],
    };
  } else if (amountOfArguments === 2) {
    return {
      paddingVertical: args[0],
      paddingHorizontal: args[1],
    };
  } else if (amountOfArguments === 3) {
    return {
      paddingTop: args[0],
      paddingRight: args[1],
      paddingBottom: args[2],
      paddingLeft: 0,
    };
  } else if (amountOfArguments === 4) {
    return {
      paddingTop: args[0],
      paddingRight: args[1],
      paddingBottom: args[2],
      paddingLeft: args[3],
    };
  }
});
