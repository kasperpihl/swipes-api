import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import GoalList from './GoalList';

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
  }
  onGoalClick(goalId) {
    const { navPush } = this.props;

    this.saveState();
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

    return (
      <GoalList
        goals={goals}
        savedState={savedState}
        delegate={this}
        myId={myId}
      />
    );
  }
}

const mapStateToProps = state => ({
  goals: cs.goals.assignedGroupedByMilestone(state),
  myId: state.getIn(['me', 'id']),
});


const { func, object } = PropTypes;
HOCGoalList.propTypes = {
  goals: map,
  savedState: object,
  saveState: func,
  openSecondary: func,
  navPush: func,
  delegate: object,
};

export default navWrapper(connect(mapStateToProps, {
  saveCache: ca.cache.save,
})(HOCGoalList));
