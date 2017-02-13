import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll, setupCachedCallback } from 'classes/utils';

// now use events as onClick: this.onWinClickCached(i)
import Icon from 'Icon';
import './topbar.scss';
import gradient from './gradient';

class Topbar extends Component {
  constructor(props) {
    super(props);
    const gradientPos = gradient.getGradientPos();
    this.state = {
      gradientPos,
    };
    bindAll(this, ['gradientStep', 'onRetry']);
    this.onWinClickCached = setupCachedCallback(this.onWinClick, this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
  }
  onWinClick(name) {
    console.log('name', name);
    window.ipcListener[name]();
  }
  onRetry(e) {
    console.log('yo', e);
  }
  gradientStep() {
    const gradientPos = gradient.getGradientPos();

    if (this.state.gradientPos !== gradientPos) {
      this.setState({ gradientPos });
    }

    setTimeout(this.gradientStep, 3000);
  }
  returnStatusIndicator() {
    const { status } = this.props;
    let className = 'topbar__gradient topbar__gradient--status';
    let statusMessage = '';
    if (status === 'offline') {
      className += ' topbar__gradient--indicate';
      statusMessage = 'Offline - retrying in 10 seconds';
    } else if (status === 'connecting') {
      className += ' topbar__gradient--indicate';
      statusMessage = 'System is connecting';
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
    const { isMaximized } = this.props;
    let toggleMaximizeIcon = 'Plus';
    let toggleMaximizeFunc = 'maximize';

    if (isMaximized) {
      toggleMaximizeIcon = 'Reload';
      toggleMaximizeFunc = 'unmaximize';
    }

    return (
      <div className="topbar__window-actions">
        <div
          onClick={this.onWinClickCached('minimize')}
          className="topbar__button topbar__button--minimize"
        >
          <Icon svg="Minus" className="topbar__svg" />
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
          <Icon svg="Close" className="topbar__svg" />
        </div>
      </div>
    );
  }
  render() {
    const styles = gradient.getGradientStyles();
    if (this.state.gradientPos) {
      styles.backgroundPosition = `${this.state.gradientPos}% 50%`;
    }

    return (
      <div className="topbar">
        <div className="topbar__gradient topbar__gradient--main" style={styles} />
        {this.returnStatusIndicator()}
        {this.renderWindowsActions()}
      </div>
    );
  }
}

export default Topbar;
