import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from '../../../swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    ...Platform.select({
      ios: {
        height: 44,
        paddingTop: 20,
      },
      android: {
        height: 48,
        paddingTop: 24,
      }
    }),
    position: 'absolute',
    left: 0, top: 0,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  statusMessage: {
    fontSize: 12,
    color: 'white',
  }
})

class HOCConnectionBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: 0,
      connected: false,
    };
    setupLoading(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.nextRetry !== this.props.nextRetry) {
      clearTimeout(this._retryTimer);
      if (nextProps.nextRetry) {
        this.updateSecondsLeft(nextProps.nextRetry);
      }
    }

    const { status, versionInfo, ready, reconnectAttempt } = nextProps;

    const { secondsLeft, connected } = this.state;
    let statusMessage = null;
    let statusColor = null;

    if (versionInfo && versionInfo.get('updateRequired')) {
      statusMessage = 'Offline - new version required';
      statusColor = colors.red80;
    } else if (versionInfo && versionInfo.get('updateAvailable')) {
      statusMessage = 'New version available';
      statusColor = colors.red80;
    } else if (versionInfo && versionInfo.get('reloadRequired')) {
      statusMessage = 'Offline - new version required';
      statusColor = colors.red80;
    } else if (versionInfo && versionInfo.get('reloadAvailable')) {
      statusMessage = 'New version available';
      statusColor = colors.red80;
    } else if (status === 'offline') {
      statusMessage = `Offline - retrying in ${secondsLeft} seconds`;
      statusColor = colors.red80;
    } else if (status === 'connecting') {
      statusMessage = 'Connecting...';
      statusColor = colors.yellowColor;
    }

    if (status === 'online' && this.props.status === 'connecting') {
      statusMessage = 'Connected';
      statusColor = colors.greenColor;

      this.connectedTimer = setTimeout(() => {
        this.setState({ statusMessage: null });
      }, 1337)
    }

    if (statusMessage !== this.state.statusMessage) {
      this.setState({ statusMessage, statusColor });
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillUnmount() {
    clearTimeout(this.connectedTimer);
  }
  updateSecondsLeft(nextRetry) {
    nextRetry = nextRetry || this.props.nextRetry;
    const secUnrounded = this.secondsToTime(nextRetry) / 1000;
    const secRounded = parseInt(secUnrounded, 10);
    const remainder = Math.max(((secUnrounded - secRounded) * 1000) + 1, 10);
    if (this.state.secondsLeft !== secRounded) {
      this.setState({ secondsLeft: secRounded });
    }
    clearTimeout(this._retryTimer);
    this._retryTimer = setTimeout(this.updateSecondsLeft.bind(this), remainder);
  }
  secondsToTime(time) {
    const now = new Date().getTime();
    return time.getTime() - now;
  }
  render() {
    const { token } = this.props;
    const { statusMessage, statusColor } = this.state;

    if (!statusMessage || !token) {
      return null;
    }

    return (
      <View style={[styles.container, {backgroundColor: statusColor}]}>
        <Text style={styles.statusMessage}>{statusMessage}</Text>
      </View>
    );
  }
}
// const { string } = PropTypes;

HOCConnectionBar.propTypes = {};

const mapStateToProps = (state) => ({
  nextRetry: state.getIn(['connection', 'nextRetry']),
  versionInfo: state.getIn(['connection', 'versionInfo']),
  reconnectAttempt: state.getIn(['connection', 'reconnectAttempt']),
  ready: state.getIn(['connection', 'ready']),
  status: state.getIn(['connection', 'status']),
  token: state.getIn(['connection', 'token']),
});

export default connect(mapStateToProps, {

})(HOCConnectionBar);
