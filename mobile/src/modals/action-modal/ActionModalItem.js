import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Iterable } from 'immutable';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import Icon from '../../components/icons/Icon';
import RippleButton from '../../components/ripple-button/RippleButton';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    width: 275,
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  leftIcon: {
    marginRight: 15,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.deepBlue80,
  },
  selector: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
});

class ActionModalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    setupDelegate(this);
    this.callDelegate.bindAll('onItemPress');
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  renderLeftIcon() {
    const { item } = this.props;

    if (item.getIn(['leftIcon', 'user'])) {
      return (
        <View style={styles.leftIcon}>
          <HOCAssigning assignees={[item.getIn(['leftIcon', 'user'])]} />
        </View>
      );
    } else if (item.getIn(['leftIcon', 'icon'])) {
      return (
        <View style={styles.leftIcon}>
          <Icon name={item.getIn(['leftIcon', 'icon'])} width="24" height="24" fill={colors.deepBlue80} />
        </View>
      );
    }

    return undefined;
  }
  renderTitle() {
    const { item } = this.props;

    return (
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{item.get('title')}</Text>
      </View>
    );
  }
  renderSelector() {
    const { multiple, item } = this.props;

    if (multiple) {
      const isSelected = item.get('selected');
      const selectedBorder = isSelected ? 'rgba(255,255,255,0)' : colors.deepBlue20;

      return (
        <View style={[styles.selector, { borderColor: selectedBorder }]}>
          {isSelected ? (
            <Icon name="ChecklistCheckmark" width="24" height="24" fill={colors.greenColor} />
          ) : (
              undefined
            )}
        </View>
      );
    }

    return undefined;
  }
  render() {
    const { item } = this.props;

    return (
      <RippleButton rippleColor={colors.deepBlue40} rippleOpacity={0.8} style={styles.container} onPress={this.onItemPressCached(item)}>
        <View style={styles.container}>
          {this.renderLeftIcon()}
          {this.renderTitle()}
          {this.renderSelector()}
        </View>
      </RippleButton>
    );
  }
}

export default ActionModalItem;
