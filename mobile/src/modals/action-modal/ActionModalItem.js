import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import HOCAssigning from 'components/assignees/HOCAssigning';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  containerButton: {
    height: 54,
  },
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  leftIcon: {
    marginRight: 15,
  },
  titleWrapper: {

  },
  title: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.deepBlue100,
  },
  selector: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
  },
});

class ActionModalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onItemPress');
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
    const { item, singleRender } = this.props;

    let extraTitleStyles = {

    };

    if (!singleRender) {
      extraTitleStyles = {
        flex: 1,
      };
    }


    return (
      <View style={[styles.titleWrapper, extraTitleStyles]}>
        <Text selectable={true} style={styles.title}>{item.get('title')}</Text>
      </View>
    );
  }
  renderSelector() {
    const { multiple, item } = this.props;

    if (multiple) {
      const isSelected = item.get('selected');
      const selectedBorder = isSelected ? colors.blue100 : colors.deepBlue30;
      const backgroundColor = isSelected ? colors.blue100 : colors.bgColor;

      return (
        <View style={[styles.selector, { borderColor: selectedBorder, backgroundColor: backgroundColor }]} />
      );
    }

    return undefined;
  }
  render() {
    const { item, singleRender } = this.props;
    const backgroundColor = item.get('selected') ? colors.blue5 : colors.bgColor;

    let extraStyle = {

    };

    if (!singleRender) {
      extraStyle = {
        flex: 1,
      };
    }

    return (
      <RippleButton rippleColor={colors.blue100} rippleOpacity={0.8} style={[styles.containerButton, extraStyle]} onPress={this.onItemPressCached(item.get('id'), item)}>
        <View style={[styles.container, extraStyle, { backgroundColor }]}>
          {this.renderLeftIcon()}
          {this.renderTitle()}
          {this.renderSelector()}
        </View>
      </RippleButton>
    );
  }
}

export default ActionModalItem;
