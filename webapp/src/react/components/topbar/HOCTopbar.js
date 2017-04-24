import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';

// now use events as onClick: this.onWinClickCached(i)
import Icon from 'Icon';
import Button from 'Button';
import './topbar.scss';


class HOCTopbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: 0,
    };
    bindAll(this, ['onDownload']);
    this.onWinClickCached = setupCachedCallback(this.onWinClick, this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.nextRetry !== this.props.nextRetry) {
      clearTimeout(this._retryTimer);
      if (nextProps.nextRetry) {
        this.updateSecondsLeft(nextProps.nextRetry);
      }
    }
  }
  onWinClick(name) {
    window.ipcListener[name]();
  }
  onDownload() {
    const { versionInfo } = this.props;
    window.open(versionInfo.get('updateUrl') || 'http://google.com');
  }
  onReload() {
    window.ipcListener.reload();
  }
  onRetry() {
    window.socket.connect();
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
    const { status, versionInfo, lastConnect, token, reconnectAttempt } = this.props;
    if (!token) {
      return undefined;
    }
    const { secondsLeft } = this.state;
    let className = 'topbar__status';
    let statusMessage;
    let btn;

    if (versionInfo && versionInfo.get('updateRequired')) {
      statusMessage = 'Offline - new version required';
      btn = this.renderDownloadBtn();
    } else if (versionInfo && versionInfo.get('updateAvailable')) {
      statusMessage = 'New version available';
      btn = this.renderDownloadBtn();
    } else if (versionInfo && versionInfo.get('reloadRequired')) {
      statusMessage = 'Offline - new version required';
      btn = this.renderReloadBtn();
    } else if (versionInfo && versionInfo.get('reloadAvailable')) {
      statusMessage = 'New version available';
      btn = this.renderReloadBtn();
    } else if (status === 'offline' && lastConnect) {
      if (reconnectAttempt > 4) {
        statusMessage = `Offline - retrying in ${secondsLeft} seconds`;
        btn = this.renderRetryBtn();
      }
    } else if (status === 'connecting' && lastConnect) {
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
  renderDownloadBtn() {
    return (
      <Button primary small text="download" onClick={this.onDownload} className="topbar__retry-btn" />
    );
  }
  renderRetryBtn() {
    return (
      <Button primary small text="Retry now" onClick={this.onRetry} className="topbar__retry-btn" />
    );
  }
  renderReloadBtn() {
    return (
      <Button primary small text="Reload" onClick={this.onReload} className="topbar__retry-btn" />
    );
  }
  renderTrialIndicator() {
    const { me } = this.props;
    const daysLeft = msgGen.orgs.getDaysLeft();
    const isAdmin = msgGen.me.isAdmin(me && me.get('id'));
    if (!isAdmin || typeof daysLeft !== 'number' || daysLeft <= 0) {
      return undefined;
    }
    return (
      <div className="topbar__trial">{`${daysLeft} days left in trial`}</div>
    );
  }
  renderWindowsActions() {
    const { isMaximized, isFullscreen } = this.props;
    let toggleMaximizeIcon = 'WindowsMaximize';
    let toggleMaximizeFunc = 'maximize';

    if (isMaximized) {
      toggleMaximizeIcon = 'WindowsUnmaximize';
      toggleMaximizeFunc = 'unmaximize';
    }
    if (isFullscreen) {
      toggleMaximizeIcon = 'WindowsUnmaximize';
      toggleMaximizeFunc = 'unFullscreen';
    }

    return (
      <div className="topbar__window-actions">
        <div
          onClick={this.onWinClickCached('minimize')}
          className="topbar__button topbar__button--minimize"
        >
          <Icon icon="WindowsMinimize" className="topbar__svg" />
        </div>
        <div
          onClick={this.onWinClickCached(toggleMaximizeFunc)}
          className="topbar__button topbar__button--unmaximize"
        >
          <Icon icon={toggleMaximizeIcon} className="topbar__svg" />
        </div>
        <div
          onClick={this.onWinClickCached('close')}
          className="topbar__button topbar__button--close"
        >
          <Icon icon="WindowsClose" className="topbar__svg" />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="topbar">
        {this.renderTrialIndicator()}
        {this.renderStatusIndicator()}
        {this.renderWindowsActions()}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    me: state.get('me'),
    nextRetry: state.getIn(['connection', 'nextRetry']),
    versionInfo: state.getIn(['connection', 'versionInfo']),
    reconnectAttempt: state.getIn(['connection', 'reconnectAttempt']),
    isMaximized: state.getIn(['main', 'isMaximized']),
    isFullscreen: state.getIn(['main', 'isFullscreen']),
    lastConnect: state.getIn(['connection', 'lastConnect']),
    status: state.getIn(['connection', 'status']),
    token: state.getIn(['connection', 'token']),
  };
}

export default connect(mapStateToProps, {
})(HOCTopbar);

const { object, string, bool } = PropTypes;
HOCTopbar.propTypes = {
  disableStatus: bool,
  nextRetry: object,
  versionInfo: map,
  status: string,
  lastConnect: string,
  isMaximized: bool,
  isFullscreen: bool,
};
