import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import { randomString } from 'swipes-core-js/classes/utils';
import StyleDomHandler from './style-dom-handler';

let mixins = {};
let packageName = 'swiss';

const swiss = (EL, styles) => {
  // Support only the parameter as the styles (use a div then)
  if(typeof EL === 'object') {
    styles = EL;
    EL = 'div';
  }
  
  // Make sure we got the right parameters
  if(!styles || typeof styles !== 'object') {
    return console.warn(`${packageName} needs styles object as first or second parameter`);
  }
  if(!EL || typeof EL !== 'string') {
    return console.warn(`${packageName} needs the first parameter to be a string of the desired html element`);
  }
  
  // Assume styles are the default if default is not provided
  if(!styles.default) {
    styles = { default: styles };
  }  
  // make sure first char is a letter! css does not support classes that starts with num
  const firstLetter = randomString(1, 'abcdefghijklmnopqrstuvwxyz');
  const className = `${firstLetter + randomString(6)}`;
  const styleHandler = new StyleDomHandler(className, styles, mixins);

  class StyledElement extends PureComponent {
    componentWillMount() {
      styleHandler.subscribe(this.props);
    }
    componentWillUnmount() {
      styleHandler.unsubscribe(this.props);
    }
    componentWillReceiveProps(nextProps) {
      styleHandler.subscribe(nextProps, this.props);
    }
    render() {
      const variables = styleHandler.getVariables();
      let computedClassName = className;
      variables.forEach(vari => {
        if(this.props[vari]) {
          computedClassName += ` ${className}-${vari}`;
        }
      });
      const newProps = {};
      Object.entries(this.props).forEach(([name, value]) => {
        if(name !== 'className' && variables.indexOf(name) === -1) {
          newProps[name] = value;
        }
      })

      return <EL className={computedClassName} {...newProps}>{this.props.children}</EL>;
    }
  }

  StyledElement.ref = `.${className}`;

  return StyledElement;
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


