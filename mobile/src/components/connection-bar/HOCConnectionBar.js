import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import { colors, viewSize } from 'globalStyles';

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
    marginBottom: Platform.OS === 'ios' ? -20 : -24,
    zIndex: 9999,
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
    if (nextProps.status === 'online' && this.props.status === 'connecting') {
      this.setLoading('connected', 'Connected', 1337);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  updateSecondsLeft(nextRetry) {
    nextRetry = nextRetry || this.props.nextRetry;
    const secUnrounded = this.secondsToTime(nextRetry) / 1000;
    const secRounded = parseInt(secUnrounded, 10);
    const remainder = Math.max(((secUnrounded - secRounded) * 1000) + 1, 10);
    if (!this.unmounted && this.state.secondsLeft !== secRounded) {
      this.setState({ secondsLeft: secRounded });
    }
    clearTimeout(this._retryTimer);
    this._retryTimer = setTimeout(this.updateSecondsLeft.bind(this), remainder);
  }
  secondsToTime(time) {
    const now = new Date().getTime();
    return time.getTime() - now;
  }
  getStatusMessage() {
    const { status, versionInfo, ready, reconnectAttempt } = this.props;

    const { secondsLeft } = this.state;
    let message = null;
    let color = null;

    if (status === 'connecting') {
      message = 'Connecting...';
      color = colors.yellowColor;
    } else  if (versionInfo && versionInfo.get('maintenance')) {
      message = 'Offline - under maintenance';
      color = colors.red80;
    } else if (versionInfo && (versionInfo.get('updateRequired') || versionInfo.get('reloadRequired'))) {
      message = 'Offline - new version required';
      color = colors.red80;
    } else if (status === 'offline') {
      message = `Offline - retrying in ${secondsLeft} seconds`;
      color = colors.red80;
    } else if (this.isLoading('connected')) {
      message = 'Connected';
      color = colors.greenColor;
    }

    return {
      message,
      color,
    };
  }
  render() {
    const { token } = this.props;
    const { statusColor } = this.state;
    const status = this.getStatusMessage();

    if (!status.message || !token) {
      return null;
    }

    return (
      <View style={[styles.container, {backgroundColor: status.color}]}>
        <Text selectable={true} style={styles.statusMessage}>{status.message}</Text>
      </View>
    );
  }
}
// const { string } = PropTypes;

HOCConnectionBar.propTypes = {};

const mapStateToProps = (state) => ({
  nextRetry: state.connection.get('nextRetry'),
  versionInfo: state.connection.get('versionInfo'),
  reconnectAttempt: state.connection.get('reconnectAttempt'),
  ready: state.connection.get('ready'),
  status: state.connection.get('status'),
  token: state.connection.get('token'),
});

export default connect(mapStateToProps, {

})(HOCConnectionBar);
