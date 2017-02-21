import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupCachedCallback } from 'classes/utils';

// now use events as onClick: this.onWinClickCached(i)
import Icon from 'Icon';
import './topbar.scss';


class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: 0,
    };
    bindAll(this, ['onRetry']);
    this.onWinClickCached = setupCachedCallback(this.onWinClick, this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
  onRetry() {
    window.socket.connect();
  }
  updateSecondsLeft(nextRetry) {
    nextRetry = nextRetry || this.props.nextRetry;
    const secUnrounded = this.secondsToTime(nextRetry) / 1000;
    const secRounded = parseInt(secUnrounded, 10);
    const remainder = ((secUnrounded - secRounded) * 1000) + 1;
    this.setState({ secondsLeft: secRounded });
    this._retryTimer = setTimeout(this.updateSecondsLeft.bind(this), remainder);
  }
  secondsToTime(time) {
    const now = new Date().getTime();
    return time.getTime() - now;
  }
  returnStatusIndicator() {
    const { status } = this.props;
    const { secondsLeft } = this.state;
    let className = 'topbar__gradient topbar__gradient--status';
    let statusMessage = '';
    if (status === 'offline') {
      className += ' topbar__gradient--indicate';
      statusMessage = `Offline - retrying in ${secondsLeft} seconds`;
    } else if (status === 'connecting') {
      className += ' topbar__gradient--indicate';
      statusMessage = 'Connecting...';
    }

    return (
      <div className={className}>
        <div className="topbar__title">
          {statusMessage}
        </div>
        <div className="topbar__retry-btn" onClick={this.onRetry}>Retry now</div>
      </div>
    );
  }
  renderWindowsActions() {
    const { isMaximized, isFullscreen } = this.props;
    let toggleMaximizeIcon = 'WindowsMaximize';
    let toggleMaximizeFunc = 'maximize';
    console.log('isMaximized', isMaximized);
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
          <Icon svg="WindowsMinimize" className="topbar__svg" />
        </div>
        <div
          onClick={this.onWinClickCached(toggleMaximizeFunc)}
          className="topbar__button topbar__button--unmaximize"
        >
          <Icon svg={toggleMaximizeIcon} className="topbar__svg" />
        </div>
        <div
          onClick={this.onWinClickCached('close')}
          className="topbar__button topbar__button--close"
        >
          <Icon svg="WindowsClose" className="topbar__svg" />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="topbar">
        {this.returnStatusIndicator()}
        {this.renderWindowsActions()}
      </div>
    );
  }
}

export default Topbar;

const { object, string, bool } = PropTypes;
Topbar.propTypes = {
  nextRetry: object,
  status: string,
  isMaximized: bool,
  isFullscreen: bool,
};
