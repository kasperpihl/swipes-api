import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { cache, goals } from 'swipes-core-js/actions';
import { map, list } from 'react-immutable-proptypes';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { fromJS } from 'immutable';
import TabMenu from 'context-menus/tab-menu/TabMenu';

import Notify from './Notify';


class HOCNotify extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    const savedState = props.savedState && props.savedState.get('notify');
    const notify = props.notify || fromJS({});

    this.state = {
      notify: savedState || fromJS({
        flags: notify.get('flags') || [],
        reply_to: notify.get('reply_to') || null,
        assignees: notify.get('assignees') || [],
        message: notify.get('message') || '',
        request: notify.get('request') || false,
        notification_type: notify.get('notification_type') || 'update',
      }),
    };

    const helper = this.getHelper();
    if (typeof notify.get('reply_to') === 'number') {
      this.state.replyObj = helper.getActivityByIndex(notify.get('reply_to'));
    }
    setupLoading(this);
    this.onChangeClick = this.onChangeClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const { goal, navPop } = this.props;
    if (!goal) {
      navPop();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
  }
  onSubmit() {
    const { goalNotify, goal, navPop } = this.props;
    const { notify } = this.state;
    this.setLoading('button');
    goalNotify(goal.get('id'), notify).then((res) => {
      if (res && res.ok) {
        window.analytics.sendEvent('Notify');
        navPop();
      } else {
        this.clearLoading('button', '!Something went wrong');
      }
    });
  }
  onFlag(id) {
    let { notify } = this.state;
    if (notify.get('flags').includes(id)) {
      notify = notify.updateIn(['flags'], fl => fl.filter(f => f !== id));
    } else {
      notify = notify.updateIn(['flags'], fl => fl.push(id));
    }
    this.updateHandoff(notify);
  }
  onSelectEmpty(options) {
    const helper = this.getHelper();
    const { contextMenu, me } = this.props;
    const { notify } = this.state;
    const all = helper.getAllInvolvedAssignees().filter(uId => uId !== me.get('id'));
    const inStep = helper.getCurrentAssignees()
                          .filter(uId => uId !== me.get('id'));
    const prevStep = helper.getAssigneesForStepIndex(helper.getNumberOfCompletedSteps() - 1)
                          .filter(uId => uId !== me.get('id'));
    const items = [];
    const shouldShow = (from, arrayTo) => {
      if (!from.size) {
        return false;
      }
      let show = true;
      arrayTo.forEach((to) => {
        if (to.size === from.size) {
          const hasDifferent = from.find(id => !to.includes(id));
          if (show && !hasDifferent) {
            show = false;
          }
        }
      });
      return show;
    };
    if (shouldShow(all, [])) {
      items.push({
        subtitle: 'Everyone in goal',
        assignees: all,
        title: msgGen.users.getNames(all, { number: 4 }),
      });
    }
    if (shouldShow(inStep, [all])) {
      items.push({
        subtitle: `Current assignee${prevStep.size > 1 ? 's' : ''}`,
        assignees: inStep,
        title: msgGen.users.getNames(inStep, { number: 4 }),
      });
    }
    if (shouldShow(prevStep, [inStep, all])) {
      items.push({
        subtitle: `Previous assignee${prevStep.size > 1 ? 's' : ''}`,
        assignees: prevStep,
        title: msgGen.users.getNames(prevStep, { number: 4 }),
      });
    }

    items.push({ title: 'Yourself', assignees: [me.get('id')] });
    items.push({ title: 'Choose people' });
    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        if (!item.assignees) {
          this.onSelectAssignees(options, notify.get('assignees'));
        } else {
          this.updateHandoff(notify.set('assignees', fromJS(item.assignees)));
        }
      },
    };

    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });
  }
  onSelectAssignees(options, newAssignees) {
    const { selectAssignees } = this.props;

    selectAssignees(Object.assign({ actionLabel: 'Done' }, options), newAssignees.toJS(), (assignees) => {
      const { notify } = this.state;
      if (assignees) {
        this.updateHandoff(notify.set('assignees', fromJS(assignees)));
      }
    });
  }
  onHandoffChange(text) {
    const { notify } = this.state;
    this.updateHandoff(notify.set('message', text));
  }
  onChangeClick(e) {
    const { notify } = this.state;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
    if(!notify.get('assignees').size){
      this.onSelectEmpty(options);
    } else {
      this.onSelectAssignees(options, notify.get('assignees'));
    }
  }
  onAssign(index, e) {
    this.onChangeClick(e);
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  willOpenPreview() {
    const { notify } = this.state;
    const { saveState } = this.props;
    saveState({ notify });
  }
  updateHandoff(notify) {
    this.setState({ notify });
  }


  render() {
    const { goal, me } = this.props;
    const { notify, replyObj } = this.state;

    return (
      <Notify
        goal={goal}
        me={me}
        delegate={this}
        replyObj={replyObj}
        notify={notify}
        loadingState={this.getAllLoading()}
      />
    );
  }
}

const { func, object } = PropTypes;
HOCNotify.propTypes = {
  navPop: func,
  notify: map,
  saveState: func,
  savedState: object,
  goalNotify: func,
  selectAssignees: func,
  goal: map,
  me: map,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  selectAssignees: a.goals.selectAssignees,
  contextMenu: a.main.contextMenu,
  saveCache: cache.save,
  goalNotify: goals.notify,
})(HOCNotify);
