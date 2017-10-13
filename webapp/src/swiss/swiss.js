import componentWrapper from './component-wrapper';

let mixins = {};

const swiss = (EL, styles) => {
  // Support only the parameter as the styles (use a div then)
  if(typeof EL === 'object') {
    styles = EL;
    EL = 'div';
  }
  
  // Make sure we got the right parameters
  if(!styles || typeof styles !== 'object') {
    return console.warn('swiss needs styles object as first or second parameter');
  }
  if(!EL || typeof EL !== 'string') {
    return console.warn('swiss needs first parameter to be the desired html tag as a string');
  }
  
  // Assume styles are the default if default is not provided
  if(!styles.default) {
    styles = { default: styles };
  }

  return componentWrapper(EL, styles, mixins);

}

swiss.addMixin = (name, handler) => {
  if(typeof name !== 'string') {
    return console.warn('swiss addMixin: first argument should be name of mixin');
  }
  if(typeof handler !== 'function') {
    return console.warn('swiss addMixin: second argument should be the mixin handler');
  }
  if(!name.startsWith('_')) {
    name = `_${name}`;
  }
  mixins[name] = handler;
}

export default swiss;


