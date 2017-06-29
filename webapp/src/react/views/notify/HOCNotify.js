import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
        window.analytics.sendEvent('Notification sent', {
          Request: !!notify.get('request'),
          Type: notify.get('notification_type'),
          Reply: !!(typeof notify.get('reply_to') === 'number'),
        });
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
  onSelectAssignees(options, newAssignees) {
    const { selectAssignees } = this.props;

    selectAssignees(Object.assign({ actionLabel: 'Done' }, options), newAssignees.toJS(), (assignees) => {
      const { notify } = this.state;
      if (assignees) {
        this.updateHandoff(notify.set('assignees', fromJS(assignees)));
      }
    });
  }
  onHandoffChange(text, e) {
    const { notify } = this.state;
    const { autoComplete } = this.props;
    autoComplete(e.target.getBoundingClientRect());
    this.updateHandoff(notify.set('message', text));
  }
  onChangeClick(e) {
    const { notify } = this.state;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    };
    this.onSelectAssignees(options, notify.get('assignees'));
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
        {...this.bindLoading()}
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
  autoComplete: a.main.autoComplete,
  contextMenu: a.main.contextMenu,
  saveCache: cache.save,
  goalNotify: goals.notify,
  browser: a.main.browser,
})(HOCNotify);
