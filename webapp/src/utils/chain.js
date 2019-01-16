export default function(...methods) {
  return function(value) {
    methods.forEach(method => {
      if (typeof method !== 'function') {
        return console.warn('chain util received a non-function, ignoring');
      }
      value = method(value);
    });
    return value;
  };
}
