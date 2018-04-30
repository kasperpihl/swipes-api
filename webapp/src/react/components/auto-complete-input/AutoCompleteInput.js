import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'react-delegate';

class AutoCompleteInput extends PureComponent {
  constructor(props) {
    super(props);
    this.handlerCached = setupCachedCallback(this.handler, this);
  }
  onSelect = (e) => {
    window.AC.onSelect(e);
    if(this.props.onSelect) {
      this.props.onSelect(e);
    }
  }
  handler(type, e, ...rest) {
    const { options } = this.props;
    if(e.target && typeof e.target.getBoundingClientRect === 'function') {
      options.boundingRect = e.target.getBoundingClientRect();
    } else if(this.cachedTarget){
      this.cachedTarget.value = e.target.value;
      e.target = this.cachedTarget;
    }
    this.cachedTarget = e.target;
    
    const wh = window.outerHeight;
    const { top, bottom } = options.boundingRect;
    options.showOnTop = (wh - bottom) < top;
    if(window.AC[type](e, options)){
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if(typeof this.props[type] === 'function') {
      this.props[type](e, ...rest);
    }
  }
  render() {
    const {
      nodeType,
      options,
      onKeyUp,
      onKeyDown,
      onChange,
      onSelect,
      onBlur,
      delegate,
      ...rest,
    } = this.props;

    const Comp = nodeType || 'input';

    return (
      <Comp
        onKeyDown={this.handlerCached('onKeyDown')}
        onKeyUp={this.handlerCached('onKeyUp')}
        onChange={this.handlerCached('onChange')}
        onBlur={this.handlerCached('onBlur')}
        onSelect={this.onSelect}
        {...rest}
      />
    );
  }
}

export default AutoCompleteInput;

const { object } = PropTypes;

AutoCompleteInput.propTypes = {
  options: object.isRequired,
};
