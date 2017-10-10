import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import StyleDomHandler from './style-dom-handler';

let packageName = 'Swiss';

const SwipesStyles = (EL, styles) => {
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

  const className = `${EL}-${Math.random().toString(36).slice(2)}`;
  const styleHandler = new StyleDomHandler(className, styles);

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
          computedClassName += ` ${vari}`;
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

export default SwipesStyles;
