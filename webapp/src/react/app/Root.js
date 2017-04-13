import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import * as a from 'actions';
import Gradient from 'components/gradient/Gradient';
import HOCApp from 'src/react/app/HOCApp';
import HOCRegistration from 'src/react/registration/HOCRegistration';
import HOCSignupPage from 'src/react/signup-page/HOCSignupPage';

import 'src/react/global-styles/reset.scss';
import 'src/react/global-styles/app.scss';

import HOCTopbar from './topbar/HOCTopbar';

class Root extends PureComponent {
  render() {
    const { isMaximized, isFullscreen } = this.props;
    let className = `platform-${window.ipcListener.platform}`;
    if(isMaximized) className += ' window-is-maximized';
    if(isFullscreen) className += ' window-is-fullscreen';

    return (
      <div id="app" className={className}>
        <Gradient />
        <HOCTopbar />
        <Route path="/" exact={true} component={HOCApp} />
        <Route path="/login" component={HOCRegistration} />
        <Route path="/signup" component={HOCSignupPage} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isMaximized: state.getIn(['main', 'isMaximized']),
  isFullscreen: state.getIn(['main', 'isFullscreen']),
})

export default withRouter(connect(mapStateToProps, {

})(Root));

const { bool } = PropTypes;

HOCApp.propTypes = {
  isFullscreen: bool,
  isMaximized: bool,
};
