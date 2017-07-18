import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import { colors } from '../../utils/globalStyles';
import Icon from '../icons/Icon';
import RippleButton from '../ripple-button/RippleButton';

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class TabNavigationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this);
    this.callDelegate.bindAll('handlePress');
  }
  render() {
    const { icon, index, fill } = this.props;

    return (
      <RippleButton rippleColor={colors.deepBlue100} rippleOpacity={0.8} style={styles.navItem} onPress={this.handlePressCached('' + index)}>
        <View style={styles.navItem}>
          <Icon name={icon} width="24" height="24" fill={fill} />
        </View>
      </RippleButton>
    );
  }
}

export default TabNavigationItem;
