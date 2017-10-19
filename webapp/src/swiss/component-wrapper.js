import React, { PureComponent } from 'react';
import StyleDomHandler from './style-dom-handler';
import { randomString } from 'swipes-core-js/classes/utils';

export default function componentWrapper(EL, styles, mixins) {
  
  // make sure first char is a letter! css does not support classes that starts with num
  const firstLetter = randomString(1, 'abcdefghijklmnopqrstuvwxyz');
  const className = `${firstLetter + randomString(6)}`;
  const styleHandler = new StyleDomHandler(className, styles, mixins);

  class StyledElement extends PureComponent {
    componentWillMount() {
      this.refNum = styleHandler.subscribe(this.props);
    }
    componentWillUnmount() {
      styleHandler.unsubscribe(this.refNum, this.props);
    }
    componentWillReceiveProps(nextProps) {
      styleHandler.update(this.refNum, nextProps, this.props);
    }
    render() {
      const { keyProps, valueProps, allProps } = styleHandler.getVariables();
      let computedClassName = `${className} sw-${this.refNum}`;
      keyProps.forEach(vari => {
        if(this.props[vari]) {
          computedClassName += ` ${className}-${vari}`;
        }
      });
      valueProps.forEach(vari => {
        if(this.props[vari]) {
          computedClassName += ` ${className}-${vari}-${this.props[vari]}`;
        }
      });

      const newProps = {};
      Object.entries(this.props).forEach(([name, value]) => {
        if(name !== 'className' && allProps.indexOf(name) === -1) {
          newProps[name] = value;
        }
      })

      return <EL className={computedClassName} {...newProps}>{this.props.children}</EL>;
    }
  }
  StyledElement.ref = `.${className}`;
  return StyledElement;
}