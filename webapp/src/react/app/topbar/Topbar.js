import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindAll } from 'classes/utils';
import './topbar.scss';
import gradient from './gradient';

class Topbar extends Component {
  constructor(props) {
    super(props);
    const gradientPos = gradient.getGradientPos();
    this.state = {
      gradientPos,
    };
    bindAll(this, ['gradientStep']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
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
      statusMessage = 'System is offline';
    } else if (status === 'connecting') {
      className += ' topbar__gradient--indicate';
      statusMessage = 'System is connecting';
    }

    return (
      <div className={className}>
        <div className="topbar__title">
          {statusMessage}
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
      </div>
    );
  }
}

export default Topbar;
