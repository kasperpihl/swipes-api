import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll } from 'classes/utils';
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
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
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
  render() {
    const styles = gradient.getGradientStyles();

    if (this.state.gradientPos) {
      styles.backgroundPosition = `${this.state.gradientPos}% 50%`;
    }

    return (
      <div className="topbar">
        <div className="topbar__gradient topbar__gradient--main" style={styles} />
        {this.returnStatusIndicator()}
        <div className="topbar__window-actions">
          <div className="topbar__button topbar__button--minimize">
            <Icon svg="Minus" className="topbar__svg" />
          </div>
          <div className="topbar__button topbar__button--maximize">
            <Icon svg="Plus" className="topbar__svg" />
          </div>
          <div className="topbar__button topbar__button--close">
            <Icon svg="Close" className="topbar__svg" />
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
