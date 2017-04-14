import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import SwipesLoader from 'components/loaders/SwipesLoader';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';

class HOCApp extends PureComponent {
  componentDidMount() {
    window.analytics.sendEvent('App loaded', {});
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
        <HOCSidebar />
        <HOCViewController />
      </div>
    );
  }
}

const { string } = PropTypes;

HOCApp.propTypes = {
  lastConnect: string,
};

function mapStateToProps(state) {
  return {
    lastConnect: state.getIn(['connection', 'lastConnect']),
  };
}

export default withRouter(connect(mapStateToProps, {
})(HOCApp));
