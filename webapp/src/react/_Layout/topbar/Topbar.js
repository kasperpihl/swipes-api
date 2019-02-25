import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';

import Icon from 'src/react/_components/Icon/Icon';
import Button from 'src/react/_components/Button/Button';
import './topbar.scss';

@connect(state => ({
  me: state.me,
  isBrowserSupported: state.global.get('isBrowserSupported'),
  isElectron: state.global.get('isElectron'),
  nextRetry: state.connection.get('nextRetry'),
  versionInfo: state.connection.get('versionInfo'),
  reconnectAttempt: state.connection.get('reconnectAttempt'),
  isMaximized: state.main.get('isMaximized'),
  isFullscreen: state.main.get('isFullscreen'),
  status: state.connection.get('status'),
  token: state.auth.get('token')
}))
export default class Topbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.nextRetry !== this.props.nextRetry) {
      clearTimeout(this._retryTimer);
      if (nextProps.nextRetry) {
        this.updateSecondsLeft(nextProps.nextRetry);
      }
    }
  }
  onWinClickCached = cachedCallback(name => {
    window.ipcListener[name]();
  });
  onDownload = () => {
    const { versionInfo } = this.props;
    window.open(versionInfo.get('updateUrl'));
  };
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
    const remainder = Math.max((secUnrounded - secRounded) * 1000 + 1, 10);
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
    const { status, versionInfo, token, reconnectAttempt } = this.props;
    if (!token) {
      return undefined;
    }
    const { secondsLeft } = this.state;
    let className = 'topbar__status';
    let statusMessage;
    let btn;

    if (status === 'connecting') {
      statusMessage = 'Connecting...';
    } else if (versionInfo && versionInfo.get('maintenance')) {
      statusMessage = 'Offline - under maintenance.';
      btn = this.renderRetryBtn();
    } else if (versionInfo && versionInfo.get('updateRequired')) {
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
    } else if (status === 'offline') {
      if (reconnectAttempt > 0) {
        statusMessage = `Offline - retrying in ${secondsLeft} seconds`;
        btn = this.renderRetryBtn();
      }
    }

    if (statusMessage) {
      className += ' topbar__status--shown';
    }

    return (
      <div className={className}>
        <div className="topbar__header">
          <div className="topbar__title">{statusMessage}</div>
          {btn}
        </div>
      </div>
    );
  }
  renderDownloadBtn() {
    return <Button title="Download" onClick={this.onDownload} />;
  }
  renderRetryBtn() {
    return <Button title="Retry now" onClick={this.onRetry} />;
  }
  renderReloadBtn() {
    return <Button title="Reload" onClick={this.onReload} />;
  }
  renderWindowsActions() {
    const { isMaximized, isFullscreen, isElectron } = this.props;
    if (!isElectron) {
      return null;
    }
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
    const { isBrowserSupported } = this.props;
    if (!isBrowserSupported) {
      return null;
    }
    return (
      <div className="topbar">
        {this.renderStatusIndicator()}
        {this.renderWindowsActions()}
      </div>
    );
  }
}
