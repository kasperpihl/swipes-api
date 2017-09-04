import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import NoMilestoneOverview from './NoMilestoneOverview';

const DISTANCE = 100;

class HOCNoMilestoneOverview extends PureComponent {
  static maxWidth() {
    return 654;
  }
  constructor(props) {
    super(props);
    this.state = { limit: 20 };
    this.lastEnd = 0;
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
    if (e.target.scrollTop > e.target.scrollHeight - e.target.clientHeight - DISTANCE) {
      if (this.lastEnd < e.target.scrollTop + DISTANCE) {
        this.setState({ limit: this.state.limit + 20 });
        this.lastEnd = e.target.scrollTop;
      }
    }
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;

    window.analytics.sendEvent('Goal opened', {});
    navPush({
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId,
      },
    });
  }
  saveState() {
    const { saveState } = this.props;
    const savedState = {
      scrollTop: this._scrollTop,
    }; // state if this gets reopened
    saveState(savedState);
  }
  render() {
    const { savedState, goals, myId } = this.props;
    const { limit } = this.state;

    return (
      <NoMilestoneOverview
        goals={goals}
        savedState={savedState}
        delegate={this}
        myId={myId}
        limit={limit}
      />
    );
  }
}
// const { string } = PropTypes;

HOCNoMilestoneOverview.propTypes = {};

const mapStateToProps = (state) => ({
  goals: cs.goals.withoutMilestone(state),
  myId: state.getIn(['me', 'id']),
})

export default navWrapper(connect(mapStateToProps, {
})(HOCNoMilestoneOverview));
