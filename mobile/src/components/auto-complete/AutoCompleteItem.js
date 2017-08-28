import React, { PureComponent } from 'react';
import { View } from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/AutoCompleteItem.scss';

class AutoCompleteItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onAutoCompleteItemPress');
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  render() {
    return (
      <View />
    );
  }
}

export default AutoCompleteItem

// const { string } = PropTypes;

AutoCompleteItem.propTypes = {};
