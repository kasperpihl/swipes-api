import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import SwipesLoader from 'components/loaders/SwipesLoader';
import SuccessStateGradient from 'components/gradient/SuccessStateGradient';
import HOCAutoCompleting from 'components/auto-completing/HOCAutoCompleting';
import HOCTooltip from 'components/tooltip/HOCTooltip';
import HOCTrial from 'components/trial/HOCTrial';
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
    const { ready } = this.props;
    if (!ready) {
      return this.renderLoader();
    }
    return (
      <div className="content-wrapper">
        <SuccessStateGradient />
        <HOCAutoCompleting />
        <HOCTooltip />
        <HOCTrial />
        <HOCSidebar />
        <HOCViewController />
      </div>
    );
  }
}

const { bool } = PropTypes;

HOCApp.propTypes = {
  ready: bool,
};

function mapStateToProps(state) {
  return {
    ready: state.getIn(['connection', 'ready']),
  };
}

export default withRouter(connect(mapStateToProps, {
})(HOCApp));
