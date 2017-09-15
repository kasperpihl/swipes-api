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
    backgroundColor: 'rgba(255, 255, 255, .95)'
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
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.deepBlue100,
    paddingRight: 12,
  },
  actionIcon: {
    height: 54,
    width: viewSize.width / 5,
    backgroundColor: colors.deepBlue10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  animatePosStart: {}
})

class NavChanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transfromAnim: new Animated.Value(450),
    };

    setupDelegate(this, 'onNavChangeAction')
  }
  componentDidMount() {
    Animated.timing(this.state.transfromAnim, {
      toValue: 0,
      easing: Easing.bezier(.71,.35,.57,1.44),
      duration: 750,
      useNativeDriver: true
    }).start();
  }
  renderAction(icon, label, order) {
    let { transfromAnim } = this.state;

    return (
      <RippleButton style={styles.actionButton} onPress={this.onNavChangeActionCached(icon)}>
        <Animated.View style={[styles.actionWrapper, { transform: [{translateY: transfromAnim}] }]}>
          <Text selectable={true} style={styles.actionLabel}>{label}</Text>
          <View style={styles.actionIcon}>
            <Icon name={icon} width="24" height="24" fill={colors.deepBlue40} />
          </View>
        </Animated.View>
      </RippleButton>
    )
  }
  renderActions() {
    
    return (
      <View style={styles.actionsWrapper}>
        {this.renderAction('Update', 'New Update', 3)}
        {this.renderAction('Profile', 'Profile', 2)}
        {this.renderAction('Find', 'Search', 1)}
      </View>
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
