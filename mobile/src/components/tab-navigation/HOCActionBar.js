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
  },
  iconButton: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonLabel: {
    fontSize: 12,
    color: colors.blue100,
    fontWeight: 'bold',
  },
  verticalSeperator: {
    width: 1,
    height: 54,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: colors.deepBlue10,
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
  renderTextButton(key, button, onPress, seperator) {
    return (
      <RippleButton rippleColor={colors.blue100} style={styles.textButton} rippleOpacity={0.8} onPress={onPress} key={key} >
        <View style={styles.textButton}>
          {seperator ? (
            <View style={styles.verticalSeperator} />
          ) : (
              undefined
            )}
          <Text style={styles.textButtonLabel}>{button.text}</Text>
        </View>
      </RippleButton>
    );
  }
  renderIconButton(key, button, onPress, seperator) {
    return (
      <RippleButton rippleColor={colors.blue100} style={styles.iconButton} rippleOpacity={0.8} onPress={onPress} key={key}>
        <View style={styles.iconButton}>
          {seperator ? (
            <View style={styles.verticalSeperator} />
          ) : (
              undefined
            )}
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
      console.log('====================================');
      console.log('====================================');

      return actionButtons.get('buttons').map((b, i) => {
        const seperator = i === 0 ? false : true;

        if (b.text) {
          return this.renderTextButton(i, b, this.onActionClick(i), seperator);
        }

        if (b.icon) {
          return this.renderIconButton(i, b, this.onActionClick(i), seperator);
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
