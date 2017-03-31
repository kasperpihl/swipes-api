import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from './actions';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import Icon from '../icons/Icon';
import FeedbackButton from '../feedback-button/FeedbackButton';
import { colors, viewSize } from '../../utils//globalStyles';

class HOCContextButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  renderTextButton(text) {
    return (
      <FeedbackButton>
        <View style={styles.textButton}>
          <Text style={styles.textButtonLabel}>{text}</Text>
        </View>
      </FeedbackButton>
    );
  }
  renderIconButton(icon) {
    return (
      <FeedbackButton>
        <View style={styles.iconButton}>
          <Icon name={icon} width="24" height="24" fill={colors.blue100} />
        </View>
      </FeedbackButton>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {/* {this.renderIconButton('ArrowLeftLine')}*/}
        {this.renderTextButton('Add a Goal')}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {

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
