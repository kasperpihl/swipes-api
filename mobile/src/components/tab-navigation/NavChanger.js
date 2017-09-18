import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import { colors, viewSize, statusbarHeight  } from 'globalStyles';
import Icon from 'Icon';
import RippleButton from 'RippleButton';

const NAV_BAR_HEIGHT = 54;

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    height: viewSize.height - NAV_BAR_HEIGHT + statusbarHeight,
    position: 'absolute',
    left: 0, top: -viewSize.height + NAV_BAR_HEIGHT - statusbarHeight,
  },
  actionsWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  actionWrapper: {
    width: viewSize.width,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButton: {
    zIndex: 9999,
  },
  actionLabelWrapper: {
    height: 54,
    paddingLeft: ((viewSize.width / 5) - 24) / 2,
    paddingRight: 12,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: colors.deepBlue10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.deepBlue100,
  },
  actionIcon: {
    height: 54,
    width: viewSize.width / 5,
    backgroundColor: colors.deepBlue10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatePosStart: {}
})

class NavChanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transfromAnim: new Animated.Value(150),
    };

    setupDelegate(this, 'onNavChangeAction', 'onNavClose')
  }
  componentDidMount() {
    Animated.timing(this.state.transfromAnim, {
      toValue: 0,
      easing: Easing.linear,
      duration: 250,
      useNativeDriver: true
    }).start();
  }
  renderAction(icon, label) {
    let { transfromAnim } = this.state;

    return (
        <Animated.View style={[styles.actionWrapper, { transform: [{translateY: transfromAnim}] }]}>
          <RippleButton style={styles.actionButton} onPress={this.onNavChangeActionCached(icon)}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.actionLabelWrapper} >
                <Text selectable={true} style={styles.actionLabel}>{label}</Text>
              </View>
              <View style={styles.actionIcon}>
                <Icon name={icon} width="24" height="24" fill={colors.deepBlue40} />
              </View>
            </View>
          </RippleButton>
        </Animated.View>
    )
  }
  renderActions() {
    
    return (
      <RippleButton style={styles.actionsWrapper} onPress={this.onNavClose}>
        <View style={styles.actionsWrapper}>
          {this.renderAction('Update', 'Updates')}
          {this.renderAction('Profile', 'Profile')}
          {this.renderAction('Find', 'Search')}
        </View>
      </RippleButton>
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
