import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
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
    width: 64,
    backgroundColor: colors.deepBlue10,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

class NavChanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onNavChangeAction')
  }
  renderAction(icon, label) {

    return (
      <RippleButton style={styles.actionButton} onPress={this.onNavChangeActionCached(icon)}>
        <View style={styles.actionWrapper}>
          <Text selectable={true} style={styles.actionLabel}>{label}</Text>
          <View style={styles.actionIcon}>
            <Icon name={icon} width="24" height="24" fill={colors.deepBlue40} />
          </View>
        </View>
      </RippleButton>
    )
  }
  renderActions() {
    
    return (
      <View style={styles.actionsWrapper}>
        {this.renderAction('Update', 'New Update')}
        {this.renderAction('Profile', 'Profile')}
        {this.renderAction('Find', 'Search')}
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
