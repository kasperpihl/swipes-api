import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import MentionTextInput from './MentionTextInput';

class HOCMentionTextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || '',
    };
    // setupLoading(this);
  }
  onTextChange(event, newValue, newPlainTextValue, mentions) {
    const { onChange } = this.props;

    this.setState({ value: newValue });
    if(onChange) onChange(newPlainTextValue);
  }
  onFindUsers(query, callback) {

    const results = cs.users.search(this.context.store.getState(), {
      searchString: query,
    });
    callback(results.map(res => {
      const item = Object.assign({}, res.item, {
        display: res.item.profile.first_name,
      })
      return item;
    }));
  }
  render() {
    const { value } = this.state;
    const {
      value: val,
      initialValue,
      delegate,
      ...rest,
    } = this.props;

    return (
      <MentionTextInput
        ref="mention"
        value={value}
        delegate={this}
        {...rest}
      />
    );
  }
}
const { object } = PropTypes;
HOCMentionTextInput.contextTypes = { store: object };

export default connect(null, {})(HOCMentionTextInput);