import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
import * as a from 'actions';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  actionBar: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  textButton: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textButtonLabel: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '500',
    color: colors.blue100,
    fontWeight: 'bold',
  },
  verticalSeperatorLeft: {
    width: 1,
    height: 40,
    position: 'absolute',
    left: 0,
    top: Platform.OS === 'ios' ? -7 : 7,
    backgroundColor: colors.deepBlue10,
  },
  verticalSeperatorRight: {
    width: 1,
    height: 40,
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? -7 : 7,
    backgroundColor: colors.deepBlue10,
  },
});

class HOCActionBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
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
  renderTextButton(key, button, onPress, seperator) {
    const text = button.text.toUpperCase();


    return (
      <RippleButton
        rippleColor={colors.blue100}
        style={styles.textButton}
        rippleOpacity={0.8}
        onPress={onPress}
        key={key}
      >
        <View style={styles.textButton}>
          {button.seperator && button.seperator === 'left' ? <View style={styles.verticalSeperatorLeft} /> : undefined}
          <Text style={styles.textButtonLabel}>
            {text}
          </Text>
          {button.seperator && button.seperator === 'right' ? <View style={styles.verticalSeperatorRight} /> : undefined}
        </View>
      </RippleButton>
    );
  }
  renderIconButton(key, button, onPress) {
    let maxWidthStyles = {};
    let alignStyles = {};

    if (button.staticSize) {
      maxWidthStyles = {
        maxWidth: 64,
      };
    }

    if (button.alignEnd) {
      alignStyles = {
        marginLeft: 'auto',
      };
    }

    return (
      <RippleButton
        style={[styles.iconButton, maxWidthStyles, alignStyles]}
        onPress={onPress}
        key={key}
      >
        <View style={[styles.iconButton, maxWidthStyles, alignStyles]}>
          {button.seperator && button.seperator === 'left' ? <View style={styles.verticalSeperatorLeft} /> : undefined}
          <Icon
            name={button.icon}
            width="24"
            height="24"
            fill={colors.deepBlue50}
          />
          {button.seperator && button.seperator === 'right' ? <View style={styles.verticalSeperatorRight} /> : undefined}
        </View>
      </RippleButton>
    );
  }
  renderLeftIcon() {
    const { activeRoutes, actionButtons } = this.props;

    if (Platform.OS === 'ios') {
      return this.renderIconButton(
        'nav',
        { icon: 'ArrowLeftLine', seperator: 'right', staticSize: true },
        this.onPop,
      );
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
    const { actionButtons } = this.props;

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
