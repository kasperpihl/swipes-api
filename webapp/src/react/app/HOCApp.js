import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import SwipesLoader from 'components/loaders/SwipesLoader';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';
import HOCContextMenu from './context-menu/HOCContextMenu';
import HOCTooltip from './tooltip/HOCTooltip';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('src/DevTools').default; // eslint-disable-line global-require
}

class HOCApp extends PureComponent {
  componentDidMount() {
    this.checkIsLoggedIn();
  }
  componentDidMount(){
    this.checkIsLoggedIn();
  }

  checkIsLoggedIn(){
    const { token, isHydrated, history } = this.props;
    if (isHydrated && !token) {
      history.push('/login');
    }
  }

  renderLoader() {
    return <SwipesLoader center text="Loading" size={90} />;
  }
  render() {
    const { lastConnect } = this.props;
    if (!lastConnect) {
      return this.renderLoader();
    }
    return (
      <div className="content-wrapper">
        <div className="content-wrapper">
          <HOCSidebar />
          <HOCViewController />
        </div>

        <HOCContextMenu />
        <HOCTooltip />
        <DevTools />
      </div>
    );
  }
}

const { bool, string } = PropTypes;

HOCApp.propTypes = {
  lastConnect: string,
  isHydrated: bool,
  token: string,
};

function mapStateToProps(state) {
  return {
    isHydrated: state.getIn(['main', 'isHydrated']),
    status: state.getIn(['connection', 'status']),
    lastConnect: state.getIn(['connection', 'lastConnect']),
    token: state.getIn(['connection', 'token']),
  };
}

export default withRouter(connect(mapStateToProps, {
})(HOCApp));
