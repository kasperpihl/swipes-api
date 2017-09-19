import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import Button from 'Button';
// import Icon from 'Icon';

class Update extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderNoUpdate() {

  }
  renderUpdate() {
    
  }
  render() {
    return (
      <View>
        {this.renderNoUpdate()}
        {this.renderUpdate()}
      </View>
    );
  }
}

export default Update

// const { string } = PropTypes;

Update.propTypes = {};
