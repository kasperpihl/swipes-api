import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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
  counter: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        right: -10, top: 3,
      },
      android: {
        right: 3, top: 3,
      }
    }),
    paddingHorizontal: 6,
    minWidth: 21,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.red80,
    zIndex: 999,
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  updateWrapper: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    right: 20, top: 10,
    backgroundColor: colors.red100,
  }
});

class TabNavigationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'handlePress');
  }
  renderCounter() {
    const { counter } = this.props;

    if (!counter) {
      return undefined;
    }

    return (
      <View style={styles.counter}>
        <Text style={styles.counterLabel}>{counter}</Text>
      </View>
    )

  }
  renderUpdate() {
    const { updateAvailable, icon } = this.props;
    
    if (!updateAvailable) {
      return undefined;
    }

    return (
      <View style={styles.updateWrapper}></View>
    )
  }
  render() {
    const { icon, index, fill } = this.props;

    return (
      <RippleButton rippleColor={colors.deepBlue100} rippleOpacity={0.8} style={styles.navItem} onPress={this.handlePressCached('' + index)}>
        <View style={styles.navItem}>
          <Icon name={icon} width="24" height="24" fill={fill} />
          {this.renderCounter()}
          {this.renderUpdate()}
        </View>
      </RippleButton>
    );
  }
}

export default TabNavigationItem;
