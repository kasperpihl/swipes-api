import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import { colors, viewSize, statusbarHeight  } from 'globalStyles';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import * as gs from 'styles';

const NAV_BAR_HEIGHT = 54;
const ICON_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(viewSize.width, (viewSize.height - NAV_BAR_HEIGHT)),
    position: 'absolute',
    left: 0, top: -viewSize.height + NAV_BAR_HEIGHT - statusbarHeight,
  },
  actionsWrapper: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('column', 'bottom', 'right'),
    paddingBottom: 15,
  },
  actionWrapper: {
    ...gs.mixins.size(viewSize.width, 54),
    ...gs.mixins.flex('row', 'right', 'center'),
    marginTop: 12,
  },
  actionLabelWrapper: {
    ...gs.mixins.flex('center'),
    height: 54,
    paddingLeft: ((viewSize.width / 5) - ICON_SIZE) / 2,
    paddingRight: 12,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  actionLabel: {
    ...gs.mixins.font(13, colors.deepBlue100, 18, '500'),
  },
  actionIcon: {
    ...gs.mixins.size(viewSize.width / 5, 54),
    ...gs.mixins.flex('center'),
  },
})

class NavChanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transfromAnim: new Animated.Value(150),
    };

    setupDelegate(this, 'onNavChangeAction', 'onNavClose');
  }
  componentDidMount() {
    Animated.timing(this.state.transfromAnim, {
      toValue: 0,
      easing: Easing.easeOut,
      duration: 150,
      useNativeDriver: true
    }).start();
  }
  renderAction(icon, label, updateable) {
    let { updateAvailable } = this.props;
    let { transfromAnim } = this.state;
    let buttonBg = updateable && updateAvailable ? colors.blue100 : colors.deepBlue10;
    let iconFill = updateable && updateAvailable ? 'white' : colors.deepBlue40;
    let labelColor = updateable && updateAvailable ? 'white' : colors.deepBlue100;

    return (
      <Animated.View style={[styles.actionWrapper, { transform: [{translateY: transfromAnim}] }]}>
        <RippleButton ref="rippleButton" style={styles.actionButton} onPress={this.onNavChangeActionCached(icon)}>
          <View style={{flexDirection: 'row', zIndex: 9999 }}>
            <View style={[styles.actionLabelWrapper, { backgroundColor: buttonBg }]} >
              <Text style={[styles.actionLabel, { color: labelColor }]}>{label}</Text>
            </View>
            <View style={[styles.actionIcon, { backgroundColor: buttonBg }]}>
              <Icon name={icon} width="24" height="24" fill={iconFill} />
            </View>
          </View>
        </RippleButton>
      </Animated.View>
    )
  }
  renderActions() {
    
    return (
      <TouchableOpacity style={styles.actionsWrapper} activeOpacity={1} onPress={this.onNavClose}>
        <View style={styles.actionsWrapper}>
          {this.renderAction('Update', 'Updates', true)}
          {this.renderAction('Profile', 'Profile')}
          {this.renderAction('Find', 'Search')}
          {this.renderAction('QuestionMono', 'Help')}
        </View>
      </TouchableOpacity>
    )
  }
  render() {

    return (
      <View style={styles.container}>
      	{this.renderActions()}
      </View>
    );
  }
}

export default NavChanger

// const { string } = PropTypes;

NavChanger.propTypes = {};
