import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import { colors, viewSize } from 'globalStyles';
import Icon from 'Icon';
import RippleButton from 'RippleButton';

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
  miniUpdate: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    position: 'absolute',
    right: 6, top: 6,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniSwap: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    marginTop: 6,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

class TabNavigationItem extends PureComponent {
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
  renderSideIcon(icon) {
    const fill = icon === 'MiniUpdate' ? 'white' : colors.deepBlue40;
    const sideIconStyles = icon === 'MiniUpdate' ? styles.miniUpdate : styles.miniSwap;

    return (
      <View style={{width: (viewSize.width / 5), height: 54, position: 'absolute', left: 0, top: 0, backgroundColor: 'yellow', alignItems: 'flex-end'}}>
        <View style={sideIconStyles}>
          <Icon name={icon} width="18" height="18" />
        </View>
      </View>
    )
  }
  renderUpdate() {
    const { updateAvailable } = this.props;
    
    if (!updateAvailable) {
      return undefined;
    }

    return this.renderSideIcon('MiniUpdate')
  }
  renderMiniSwap() {
    const { updateAvailable, showMiniSwap } = this.props;

    if (showMiniSwap && !updateAvailable) {
      return this.renderSideIcon('MiniNavSwap')
    }
  }
  render() {
    const { icon, index, activeSliderIndex } = this.props;
    const iconFill = parseInt(activeSliderIndex) === index ? colors.deepBlue100 : colors.deepBlue40;

    return (
      <RippleButton rippleColor={colors.deepBlue100} rippleOpacity={0.8} style={styles.navItem} onPress={this.handlePressCached('' + index)}>
        <View style={styles.navItem}>
          {this.renderUpdate()}
          {this.renderMiniSwap()}
          <Icon name={icon} width="24" height="24" fill={iconFill} />
          {this.renderCounter()}
        </View>
      </RippleButton>
    );
  }
}

export default TabNavigationItem;
