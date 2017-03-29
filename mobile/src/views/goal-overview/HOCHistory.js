import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Linking } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import { fromJS, Map } from 'immutable';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils'
import { timeAgo } from '../../../swipes-core-js/classes/time-utils';
import NotificationItem from '../dashboard/NotificationItem';
import { viewSize, colors } from '../../utils/globalStyles';

class HOCHistory extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.lastY = 0;
    this.direction = 'up';
    this.callDelegate = setupDelegate(props.delegate);
    this.handleScroll = this.handleScroll.bind(this);
  }
  handleScroll(event) {
    const currentOffset = Math.max(0, event.nativeEvent.contentOffset.y);
    let direction = 'up';
    if (currentOffset > this.lastY) {
      direction = 'down';
    }
    if (direction !== this.direction) {
      this.callDelegate('onDirectionChange', direction);
      this.direction = direction;
    }
    this.lastY = currentOffset;
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  getAttachments(flags) {
    const { goal } = this.props;

    if (!flags || !goal.get('attachments')) {
      return undefined;
    }

    const at = flags.map(fId => (goal.getIn(['attachments', fId]))).filter(v => !!v);

    return fromJS(at);
  }
  getStepTitle(stepId) {
    const { goal } = this.props;
    return goal.getIn(['steps', stepId, 'title']);
  }
  openLink(att) {

    console.log('wtf')

    const link = att.get('link') || att;
    const service = link.get('service') || link;
    if (att && service.get('type') === 'url') {
      Linking.openURL(service.get('id'));
    }
  }
  getNotificationForEvent(e) {
    const { me } = this.props;
    const helper = this.getHelper();
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
    const from = msgGen.users.getName(e.get('done_by'));

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
        const to = msgGen.users.getNames(e.get('assignees'), {
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
          const titles = helper.getStepTitlesBetween(e.get('from'), e.get('to'));
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
  renderEvent(event, me, ctx) {
    if (event.get('type') === 'notified') {
      if (event.get('assignees').indexOf(me.get('id')) === -1 && event.get('done_by') !== me.get('id')) {
        return undefined;
      }
    }

    return <NotificationItem notification={event} delegate={ctx}/>
  }
  render() {
    const { goal, me } = this.props;
    const history = goal.get('history');
    const events = history.map((e, i) => this.getNotificationForEvent(e)).reverse();

    return (
      <View style={styles.container}>
        <ImmutableListView
          onScroll={this.handleScroll}
          immutableData={events}
          renderRow={(event) => this.renderEvent(event, me, this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  }
});

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCHistory);
