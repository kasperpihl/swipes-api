import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import { colors, viewSize } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    height: 55,
    position: 'absolute',
    left: 0, top: 0,
    backgroundColor: colors.red80, 
  }
})

class HOCConnectionBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: 0,
    };
    this.state = {};
    // setupLoading(this);
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
  renderStatusIndicator() {
    const { status, versionInfo, ready, token, reconnectAttempt } = this.props;
    if (!token) {
      return undefined;
    }
    const { secondsLeft } = this.state;
    let className = 'topbar__status';
    let statusMessage;

    if (versionInfo && versionInfo.get('updateRequired')) {
      statusMessage = 'Offline - new version required';
    } else if (versionInfo && versionInfo.get('updateAvailable')) {
      statusMessage = 'New version available';
    } else if (versionInfo && versionInfo.get('reloadRequired')) {
      statusMessage = 'Offline - new version required';
    } else if (versionInfo && versionInfo.get('reloadAvailable')) {
      statusMessage = 'New version available';
    } else if (status === 'offline' && ready) {
      if (reconnectAttempt > 4) {
        statusMessage = `Offline - retrying in ${secondsLeft} seconds`;
      }
    } else if (status === 'connecting' && ready) {
      if (reconnectAttempt > 4) {
        statusMessage = 'Connecting...';
      }
    }

    if (statusMessage) {
      className += ' topbar__status--shown';
    }

    return (
      <div className={className}>
        <div className="topbar__header">
          <div className="topbar__title">
            {statusMessage}
          </div>
          {btn}
        </div>
      </div>
    );
  }
  render() {
    return (
      <View style={styles.container} />
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
});

export default connect(mapStateToProps, {

})(HOCConnectionBar);
