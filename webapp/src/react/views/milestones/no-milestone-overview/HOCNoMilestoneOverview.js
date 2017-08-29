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


class HOCNoMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLine: false,
    }
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onScroll(e) {
    const { showLine } = this.state;
    let newShowLine = e.target.scrollTop > 0;

    if (showLine !== newShowLine) {
      this.setState({ showLine: newShowLine })
    }

    this._scrollTop = e.target.scrollTop;
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
    const { showLine } = this.state;

    return (
      <NoMilestoneOverview
        goals={goals}
        savedState={savedState}
        delegate={this}
        myId={myId}
        showLine={showLine}
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
