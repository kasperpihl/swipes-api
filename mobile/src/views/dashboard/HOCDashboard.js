import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { timeAgo } from '../../../swipes-core-js/classes/time-utils';
import { viewSize } from '../../utils/globalStyles';
import Dashboard from './Dashboard';
import InternalWebview from '../webview/InternalWebview';
import HOCGoalList from '../goallist/HOCGoalList';

class HOCDashboard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      filter: n => n.get('receiver') && n.get('important')
    };

    if (props.notifications) {
      this.state.notifications = this.getFilteredNotifications(props.notifications)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications !== this.props.notifications) {
      this.setState({ notifications: this.getFilteredNotifications(nextProps.notifications) });
    }
  }
  openLink(att) {
    const { onPushRoute } = this.props;

    if (att && att.getIn(['link', 'service', 'type']) === 'url') {
      const webView = {
        component: InternalWebview,
        title: att.get('title'),
        key: att.get('id'),
        props: {
          url: att.getIn(['link', 'service', 'id']),
          title: att.get('title')
        }
      };

      onPushRoute(webView);
    }
  }
  getAttachments(goalId, flags) {
    const { goals } = this.props;
    const goal = goals.get(goalId);
    if (!goal || !flags || !goal.get('attachments')) {
      return undefined;
    }
    const at = flags.map(fId => (goal.getIn(['attachments', fId]))).filter(v => !!v);
    return fromJS(at);
  }
  getFilteredNotifications(notifications) {
    return notifications.filter(this.state.filter);
  }
  getStepTitles(goalId, from, to) {
    const { goals } = this.props;
    const goal = goals.get(goalId);
    const titles = [];
    if (!goal) {
      return titles;
    }
    let show = false;
    goal.get('step_order').forEach((sI) => {
      if ([from, to].indexOf(sI) !== -1) show = !show;
      if (show) {
        titles.push(goal.getIn(['steps', sI, 'title']));
      }
    });
    return titles;
  }
  titleForGoalId(goalId) {
    const { goals } = this.props;
    const title = goals.getIn([goalId, 'title']);
    if (!title) {
      return '(archived)';
    }
    return title;
  }
  messageForNotification(n) {
    const { me, goals } = this.props;

    const id = n.getIn(['target', 'id']);
    const index = n.getIn(['target', 'history_index']);
    const h = goals.getIn([id, 'history', index]);
    const type = n.get('type');

    let m = Map({
      timeago: timeAgo(n.get('updated_at'), true),
      seenAt: !!n.get('seen_at'),
      userId: n.get('done_by'),
    });
    const from = msgGen.getUserString(n.get('done_by'));
    const to = n.get('done_by') === me.get('id') ? 'yourself' : 'you';


    if (h) {
      m = m.set('title', this.titleForGoalId(id));
      m = m.set('message', h.get('message'));
      m = m.set('attachments', this.getAttachments(id, h.get('flags')));
    } else {
      m = m.set('title', `${n.getIn(['meta', 'title'])} (archived)`);
      m = m.set('noClickTitle', !!n.get('seen_at'));
    }

    switch (type) {
      case 'goal_archived': {
        m = m.set('subtitle', `${from} archived`);
        m = m.set('title', `${n.getIn(['meta', 'title'])}`);
        m = m.set('icon', 'Archive');
        break;
      }
      case 'goal_created': {
        m = m.set('subtitle', `${from} created`);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'goal_started': {
        m = m.set('subtitle', `${from} kicked off`);
        m = m.set('icon', 'Plus');
        break;
      }
      case 'goal_notify': {
        m = m.set('subtitle', `${from} sent a notification`);
        if (h && h.get('assignees')) {
          const userString = msgGen.getUserArrayString(h.get('assignees'), {
            yourself: true,
            number: 3,
          });
          m = m.set('subtitle', `${from} notified ${userString} in`);
        }
        if (h && h.get('feedback')) {
          m = m.set('subtitle', `${from} gave ${to} feedback in`);
        }
        m = m.set('icon', 'GotNotified');
        break;
      }
      case 'step_completed': {
        if (!h) {
          m = m.set('subtitle', `${from} completed a step`);
          m = m.set('icon', 'Handoff');
          break;
        }
        const progress = h.get('progress');
        m = m.set('icon', 'Handoff');
        if (progress === 'forward') {
          m = m.set('subtitle', `${from} completed a step in`);
          m = m.set('icon', 'ActivityCheckmark');
          const titles = this.getStepTitles(id, h.get('from'), h.get('to'));
          if (titles.length > 1) {
            m = m.set('subtitle', `${from} completed ${titles.length} steps in`);
          }
        }

        if (progress === 'reassign') {
          m = m.set('subtitle', `${from} reassigned the current step in`);
          m = m.set('icon', 'Iteration');
        }

        if (progress === 'iteration') {
          m = m.set('icon', 'Iteration');
          if (!h.get('from')) {
            m = m.set('subtitle', `${from} restarted the goal`);
          } else {
            m = m.set('subtitle', `${from} made an iteration in`);
          }
        }
        break;
      }
      case 'goal_completed': {
        m = m.set('subtitle', `${from} completed the goal`);
        m = m.set('icon', 'Star');
        break;
      }
      default:
        break;
    }
    if (!m.get('title')) {
      return null;
    }
    return m;
  }
  render() {
    let { notifications: n } = this.state

    if (n) {
      n = n.map(n => this.messageForNotification(n));
    }

    return (
      <View style={styles.container}>
        <Dashboard notifications={n} delegate={this} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {})(HOCDashboard);