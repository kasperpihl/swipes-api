import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/screen-size-overlay.scss';

class HOCScreenSizeOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tooSmall: false,
    };
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');

    bindAll(this, ['updateWindowDimensions']);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if ((width < 800 || height < 600) && !this.state.tooSmall) {
      this.setState({ tooSmall: true })
    } else if ((width >= 800 && height >= 600) && this.state.tooSmall) {
      this.setState({ tooSmall: false })
    }

    this.setState({ width, height });
  }
  renderCurrentSize() {
    const { width, height } = this.state;
    
    return (
      <div className="screen-size-overlay__current-size">
        {`${width}x${height}`}
      </div>
    )
  }
  render() {
    const { isDev } = this.props;
    if(isDev) {
      return null;
    }
    const { tooSmall, width, height } = this.state;
    let className = 'screen-size-overlay';

    if (tooSmall) className += ' screen-size-overlay--too-small';

    return (
      <div className={className}>
        <div className="screen-size-overlay__title">
          Your browser window is too small :(
        </div>

        <div className="screen-size-overlay__subtitle">
          The minimum supported size is 800x600 pixels
        </div>
        {this.renderCurrentSize()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isDev: state.getIn(['globals', 'isDev']),
});

export default connect(mapStateToProps, {
})(HOCScreenSizeOverlay);

// const { string } = PropTypes;

HOCScreenSizeOverlay.propTypes = {};
