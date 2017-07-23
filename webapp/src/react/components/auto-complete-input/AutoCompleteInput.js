import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import ReactTextarea from 'react-textarea-autosize';
import ContentEditable from 'react-contenteditable';

class AutoCompleteInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
    this.handlerCached = setupCachedCallback(this.handler, this);

  }
  handler(type, e) {
    const { options } = this.props;
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
      onKeyUp,
      onKeyDown,
      onChange,
      onBlur,
      delegate,
      ...rest,
    } = this.props;

    let Comp = ReactTextarea;
    if(this.props.html) {
      Comp = ContentEditable;
    }
    return (
      <Comp
        onKeyDown={this.handlerCached('onKeyDown')}
        onKeyUp={this.handlerCached('onKeyUp')}
        onChange={this.handlerCached('onChange')}
        onBlur={this.handlerCached('onBlur')}
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
