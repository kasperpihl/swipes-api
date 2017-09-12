import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
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
    backgroundColor: 'rgba(255, 255, 255, .8)'
  }
})

class NavChanger extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderActions() {
    
  }
  render() {

    return null;

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
