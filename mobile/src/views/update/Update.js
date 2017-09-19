import React, { PureComponent } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { setupDelegate } from 'react-delegate';
import RippleButton from 'RippleButton';
import HOCHeader from 'HOCHeader';
import { colors } from 'globalStyles';

class Update extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onUpdate', 'onReload');
  }
  renderHeader() {

    return <HOCHeader title="Updates" />
  }
  renderUpdateLabel() {
    const { versionInfo } = this.props;
    let titleLabel = 'No updates available';
    
    if (versionInfo.get('reloadAvailable') || versionInfo.get('updateAvailable')) {
      titleLabel = 'A new version is available'
    }

    return (
      <View style={{ alignSelf: 'stretch', paddingVertical: 24 }}>
        <Text style={{ fontSize: 18, lineHeight: 24, color: colors.deepBlue100 }}>{titleLabel}</Text>
      </View>
    )
  }
  renderUpdateButton() {
    const { versionInfo } = this.props;
    let label = Platform.OS === 'ios' ? 'Update from App Store' : 'Update from Play Store';
    let callback = this.onUpdate;

    if (!(versionInfo.get('reloadAvailable') || versionInfo.get('updateAvailable'))) return undefined;

    if (versionInfo.get('reloadAvailable')) {
      label = 'Install now and reload app';
      callback = this.onReload;      
    }
    
    return (
      <RippleButton onPress={callback} >
        <View style={{ alignSelf: 'stretch', height: 64, borderRadius: 6, backgroundColor: colors.blue100, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold', includeFontPadding: false, textAlignVertical: 'center' }} >{label.toUpperCase()}</Text>
        </View>
      </RippleButton>
    )
  }
  render() {

    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
          {this.renderUpdateLabel()}
          {this.renderUpdateButton()}
        </ScrollView>
      </View>
    );
  }
}

export default Update

// const { string } = PropTypes;

Update.propTypes = {};
