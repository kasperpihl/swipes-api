import { addMixin } from 'swiss-react';

addMixin('margin', function margin(...args) {
  const amountOfArguments = args.length;

  if (!amountOfArguments) {
    return {
      marginHorizontal: 0,
      marginVertical: 0,
    };
  }

  if (amountOfArguments === 1) {
    return {
      marginHorizontal: args[0],
      marginVertical: args[0],
    };
  } else if (amountOfArguments === 2) {
    return {
      marginVertical: args[0],
      marginHorizontal: args[1],
    };
  } else if (amountOfArguments === 3) {
    return {
      marginTop: args[0],
      marginRight: args[1],
      marginBottom: args[2],
      marginLeft: 0,
    };
  } else if (amountOfArguments === 4) {
    return {
      marginTop: args[0],
      marginRight: args[1],
      marginBottom: args[2],
      marginLeft: args[3],
    };
  }
});