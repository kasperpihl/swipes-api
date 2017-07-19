import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    right: 5, top: 5,
    paddingHorizontal: 7.5,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.red80,
  },
  counterLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
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
  render() {
    const { icon, index, fill } = this.props;

    return (
      <RippleButton rippleColor={colors.deepBlue100} rippleOpacity={0.8} style={styles.navItem} onPress={this.handlePressCached('' + index)}>
        <View style={styles.navItem}>
          {this.renderCounter()}
          <Icon name={icon} width="24" height="24" fill={fill} />
        </View>
      </RippleButton>
    );
  }
}

export default TabNavigationItem;
