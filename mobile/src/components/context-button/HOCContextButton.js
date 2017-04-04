import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';

import * as a from '../../actions';
import { setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import Icon from '../icons/Icon';
import FeedbackButton from '../feedback-button/FeedbackButton';
import { colors, viewSize } from '../../utils/globalStyles';

class HOCContextButton extends PureComponent {
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
      <FeedbackButton onPress={onPress} key={key} >
        <View style={styles.textButton}>
          <Text style={styles.textButtonLabel}>{button.text}</Text>
        </View>
      </FeedbackButton>
    );
  }
  renderIconButton(key, button, onPress) {
    console.log(button);
    return (
      <FeedbackButton onPress={onPress} key={key} >
        <View style={styles.iconButton}>
          <Icon name={button.icon} width="24" height="24" fill={colors.blue100} />
        </View>
      </FeedbackButton>
    );
  }
  renderLeftIcon() {
    const { activeRoutes, actionButtons } = this.props;
    if (actionButtons.get('disableLeft')) {
      return undefined;
    }
    if (activeRoutes.size > 1) {
      return this.renderIconButton('nav', { icon: 'ArrowLeftLine' }, this.onPop);
    }
    return this.renderIconButton('nav', { icon: 'Close' });
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
  }
  render() {
    return (
      <View style={styles.container}>
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
})(HOCContextButton);

const styles = StyleSheet.create({
  container: {
    width: viewSize.width - 18,
    height: 70,
    left: 9,
    position: 'absolute',
    bottom: 21,
    borderRadius: 6,
    backgroundColor: colors.bgColor,
    overflow: 'hidden',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: colors.deepBlue100,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
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
    fontWeight: 'bold',
    color: colors.blue100,
  },
});
