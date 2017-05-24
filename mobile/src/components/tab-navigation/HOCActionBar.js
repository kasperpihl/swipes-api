import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import * as a from '../../actions';
import Icon from '../icons/Icon';
import RippleButton from '../ripple-button/RippleButton';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  actionBar: {
    flex: 1,
    flexDirection: 'row',
  },
  textButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.deepBlue5,
    borderRightWidth: 1,
    borderRightColor: colors.deepBlue5,
  },
  iconButton: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonLabel: {
    fontSize: 15,
    color: colors.deepBlue80,
  },
  verticalSeperator: {
    width: 1,
    height: 70,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: colors.deepBlue5,
  },
});

class HOCActionBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.onPop = this.onPop.bind(this);
    this.onActionClick = setupCachedCallback(this.onActionClick, this);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onPop() {
    const { activeSliderIndex, navPop } = this.props;

    navPop(activeSliderIndex);
  }
  onActionClick(i, e) {
    const { actionButtons } = this.props;

    if (actionButtons.get('onClick')) {
      actionButtons.get('onClick')(i, e);
    }
  }
  renderTextButton(key, button, onPress) {
    return (
      <RippleButton rippleColor={colors.blue100} style={styles.textButton} rippleOpacity={0.8} onPress={onPress} key={key} >
        <View style={styles.textButton}>
          <Text style={styles.textButtonLabel}>{button.text}</Text>
        </View>
      </RippleButton>
    );
  }
  renderIconButton(key, button, onPress) {
    return (
      <RippleButton rippleColor={colors.blue100} style={styles.iconButton} rippleOpacity={0.8} onPress={onPress} key={key} >
        <View style={styles.iconButton}>
          <Icon name={button.icon} width="24" height="24" fill={colors.blue100} />
        </View>
      </RippleButton>
    );
  }
  renderLeftIcon() {
    const { activeRoutes, actionButtons } = this.props;

    if (Platform.OS === 'ios') {
      return this.renderIconButton('nav', { icon: 'ArrowLeftLine' }, this.onPop);
    }

    return undefined;
  }
  renderButtons() {
    const { actionButtons } = this.props;

    if (actionButtons && actionButtons.get('buttons')) {
      return actionButtons.get('buttons').map((b, i) => {
        if (b.text) {
          return this.renderTextButton(i, b, this.onActionClick(i));
        }

        if (b.icon) {
          return this.renderIconButton(i, b, this.onActionClick(i));
        }
      });
    }

    return undefined;
  }
  render() {
    return (
      <View style={styles.actionBar}>
        {this.renderLeftIcon()}
        {this.renderButtons()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const sliderIndex = state.getIn(['navigation', 'sliderIndex']);
  return {
    actionButtons: state.getIn(['navigation', 'actionButtons']),
    activeSliderIndex: sliderIndex,
    activeRoutes: state.getIn(['navigation', 'sliders', sliderIndex, 'routes']),
  };
}

export default connect(mapStateToProps, {
  navPop: a.navigation.pop,
})(HOCActionBar);