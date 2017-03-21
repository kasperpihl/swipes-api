import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { timeAgo } from 'classes/time-utils';
import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import NotificationWrapper from '../../dashboard/NotificationWrapper';
/* global msgGen */

class HOCHistory extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  componentDidMount() {
  }
  onClickAttachment(hI, i) {
    const { goal, preview } = this.props;
    const flag = goal.getIn(['history', hI, 'flags', i]);
    const att = goal.getIn(['attachments', flag]);
    const selection = window.getSelection();

    if (att && selection.toString().length === 0) {
      preview(this.context.target, att);
    }
  }
  getAttachments(flags) {
    const { goal } = this.props;
    if (!flags || !goal.get('attachments')) {
      return undefined;
    }
    const at = flags.map(fId => (goal.getIn(['attachments', fId]))).filter(v => !!v);
    return fromJS(at);
  }
  getStepTitles(from, to) {
    const { goal } = this.props;
    const titles = [];
    let show = false;
    goal.get('step_order').forEach((sI) => {
      if ([from, to].indexOf(sI) !== -1) show = !show;
      if (show) {
        titles.push(goal.getIn(['steps', sI, 'title']));
      }
    });
    return titles;
  }
  getStepTitle(stepId) {
    const { goal } = this.props;
    return goal.getIn(['steps', stepId, 'title']);
  }
  getNotificationForEvent(e) {
    const { me } = this.props;
    const type = e.get('type');
    let m = Map({
      timeago: timeAgo(e.get('done_at'), true),
      seenAt: true,
      userId: e.get('done_by'),
      message: e.get('message'),
      attachments: this.getAttachments(e.get('flags')),
    });
    const stepTitle = this.getStepTitle(e.get('to'));
    const fromStepTitle = this.getStepTitle(e.get('from'));
    const from = msgGen.getUserString(e.get('done_by'));
    console.log(e.toJS());
    switch (type) {
      case 'goal_started': {
        m = m.set('subtitle', `${from} kicked off this goal with`);
        m = m.set('title', stepTitle);
        break;
      }
      case 'created':
      case 'goal_created': {
        m = m.set('subtitle', `${from} created this goal`);
        break;
      }
      case 'notified':
      case 'goal_notify': {
        const yourself = e.get('done_by') === me.get('id');
        const to = msgGen.getUserArrayString(e.get('assignees'), {
          number: 3,
          yourself,
        });
        m = m.set('subtitle', `${from} notified ${to} regarding`);
        if (e.get('feedback')) {
          m = m.set('subtitle', `${from} gave feedback to ${to} regarding`);
        }
        m = m.set('title', stepTitle);
        break;
      }
      case 'complete_step':
      case 'step_completed': {
        const progress = e.get('progress');
        m = m.set('subtitle', `${from} completed the step`);
        m = m.set('title', fromStepTitle);

        if (progress === 'forward') {
          m = m.set('subtitle', `${from} completed the step`);
          const titles = this.getStepTitles(e.get('from'), e.get('to'));
          if (titles.length > 1) {
            m = m.set('subtitle', `${from} completed ${titles.length} steps`);
          }
          m = m.set('title', titles);
        }

        if (progress === 'reassign') {
          m = m.set('subtitle', `${from} reassigned the step`);
        }

        if (progress === 'iteration') {
          if (!e.get('from')) {
            m = m.set('subtitle', `${from} started the goal again from`);
            m = m.set('title', stepTitle);
          } else {
            m = m.set('subtitle', `${from} made an iteration from > to`);
            m = m.set('title', `${fromStepTitle} > ${stepTitle}`);
          }
        }

        break;
      }
      case 'complete_goal':
      case 'goal_completed': {
        m = m.set('subtitle', `${from} completed this goal`);
        break;
      }
      default:
        break;
    }
    return m;
  }
  renderEvent(e, i) {
    const { me } = this.props;
    if (e.get('type') === 'notified') {
      if (e.get('assignees').indexOf(me.get('id')) === -1 && e.get('done_by') !== me.get('id')) {
        return undefined;
      }
    }
    return (
      <NotificationWrapper
        key={i}
        i={i}
        delegate={this}
        notification={this.getNotificationForEvent(e)}
      />
    );
  }
  render() {
    const { goal } = this.props;
    const history = goal.get('history');
    return (
      <div className="history">
        {history.map((e, i) => this.renderEvent(e, i)).reverse()}
      </div>
    );
  }
}
const { string, func } = PropTypes;

HOCHistory.propTypes = {
  goal: map,
  preview: func,
  me: map,
};
HOCHistory.contextTypes = {
  target: string,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
})(HOCHistory);
