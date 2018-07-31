import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'react-delegate';

// import { fromJS } from 'immutable';
import ReactTextarea from 'react-textarea-autosize';
import ContentEditable from 'components/content-editable/ContentEditable';

class AutoCompleteInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
    this.handlerCached = setupCachedCallback(this.handler, this);

  }
  handler(type, e) {
    const { options } = this.props;
    options.boundingRect = e.target.getBoundingClientRect();
    const wh = window.outerHeight;
    const { top, bottom } = options.boundingRect;
    options.showOnTop = (wh - bottom) < top;
    if(window.AC[type](e, options)){
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if(typeof this.props[type] === 'function') {
      this.props[type](e);
    }
  }
  render() {
    const {
      options,
      onChange,
      delegate,
      ...rest,
    } = this.props;

    let Comp = ReactTextarea;
    if(typeof this.props.html === 'string') {
      Comp = ContentEditable;
    }
    if(nodeType) {
      Comp = nodeType;
    }
    return (
      <Comp
        onChange={this.handlerCached('onChange')}
        ref="input"
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
