import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { setupLoading } from 'swipes-core-js/classes/utils';
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
    setupLoading(this);
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

  onAddGoal(e) {
    const { inputMenu, createGoal } = this.props;
    const options = this.getOptionsForE(e);
    inputMenu({
      ...options,
      placeholder: 'What do you need to do?',
      buttonLabel: 'Add Goal',
    }, (title) => {
      if (title && title.length) {
        this.setLoading('add');
        createGoal(title).then((res) => {
          if (res && res.ok) {
            this.clearLoading('add');
            window.analytics.sendEvent('Goal created', {});
          } else {
            this.clearLoading('add', '!Something went wrong');
          }
        });
      }
    });
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
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
        {...this.bindLoading()}
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
  createGoal: func,
  openSecondary: func,
  navPush: func,
  delegate: object,
  inputMenu: func,
  // removeThis: PropTypes.string.isRequired
};

export default navWrapper(connect(mapStateToProps, {
  saveCache: ca.cache.save,
  createGoal: ca.goals.create,
  selectUser: a.menus.selectUser,
  selectMilestone: a.menus.selectMilestone,
  clearFilter: ca.filters.clear,
  updateFilter: ca.filters.update,
  inputMenu: a.menus.input,
  selectGoalType: a.menus.selectGoalType,
  selectAssignees: a.goals.selectAssignees,
})(HOCGoalList));
