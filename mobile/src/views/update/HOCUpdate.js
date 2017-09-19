import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Platform, Linking } from 'react-native';

import codePush from 'react-native-code-push';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * as cs from 'swipes-core-js/selectors';
import Update from './Update';

class HOCUpdate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onReload() {
    const { loading } = this.props;
    loading(true);

    codePush.sync({
      installMode: codePush.InstallMode.IMMEDIATE,
    });
  }
  onUpdate() {
    const { versionInfo } = this.props;
    const url = versionInfo.get('updateUrl');
    if(!url) {
      return;
    }
    if(Platform.OS === 'ios'){
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }
    else{
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }
  }
  render() {
    const { versionInfo } = this.props;

    return (
      <Update 
        versionInfo={versionInfo}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCUpdate.propTypes = {};

const mapStateToProps = (state) => ({
  versionInfo: state.getIn(['connection', 'versionInfo']),
});

export default connect(mapStateToProps, {
  loading: a.loading.showLoader,
})(HOCUpdate);
