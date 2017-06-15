import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import * as a from '../../actions';
import * as ca from '../../../swipes-core-js/actions';
import Dashboard from './Dashboard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class HOCDashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['received', 'sent'],
      tabIndex: 0,
      hasLoaded: false,
    };
  }
  componentWillMount() {
    const { notifications, filters } = this.props;

    if (filters) {
      const tabIndex = this.state.tabIndex;

      this.setState({
        notifications: this.getFilteredNotifications(tabIndex, notifications, filters),
      });
    }
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);

    if (this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const tabIndex = this.state.tabIndex;
      const { notifications, filters } = nextProps;

      this.setState({
        notifications: this.getFilteredNotifications(tabIndex, notifications, filters),
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('updated');
    if (!this.state.hasLoaded) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  onMark(id) {
    const { markNotifications } = this.props;
    const { notifications } = this.state;

    if (notifications.size) {
      let arg = [id];

      if (id === 'all') {
        arg = notifications.toArray().filter(n => !n.get('seen_at')).map(n => n.get('id'));
      }

      if (arg.length) {
        markNotifications(arg);
      }
    }
  }
  onChangeTab(index) {
    const { tabIndex } = this.state;

    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
        hasLoaded: false,
        notifications: this.getFilteredNotifications(index),
      });
    }
  }
  onReply(n, e) {
    const { notifications } = this.state;
    const { navPush } = this.props;
    const notification = notifications.get(n.get('i'));
    e.stopPropagation();
    this.onMark(notification.get('id'));

    navPush({
      id: 'Notify',
      title: 'Notify',
      props: {
        notify: Map({
          reply_to: notification.getIn(['target', 'history_index']),
          notification_type: notification.getIn(['meta', 'notification_type']),
          assignees: List([notification.get('done_by')]),
        }),
        goalId: notification.getIn(['target', 'id']),
      },
    });
  }
  onNotificationPress(obj) {
    const { navPush } = this.props;
    const { notifications } = this.state;
    const notification = notifications.get(obj.get('i'));

    this.onMark(notification.get('id'));

    const overview = {
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId: notification.getIn(['target', 'id']),
      },
    };

    navPush(overview);
  }
  onNotificationLongPress(n) {

  }
  getFilteredNotifications(fI, notifications, filters) {
    notifications = notifications || this.props.notifications;
    filters = filters || this.props.filters;
    const filterId = this.state.tabs[fI];

    return filters.getIn([filterId, 'notifications']).map(i => notifications.get(i));
  }
  openLink(att) {
    const { preview } = this.props;

    preview(att);
  }
  onCollapse(collapsed) {
    const { setCollapsed } = this.props;

    setCollapsed(collapsed);
  }
  render() {
    const { filters } = this.props;
    let { notifications: n, tabs } = this.state;

    if (n) {
      console.log(n.get(0).toJS());
      n = n.map((n, i) => msgGen.notifications.getNotificationWrapper(n).set('i', i));
    }

    return (
      <View style={styles.container}>
        <Dashboard
          notifications={n}
          delegate={this}
          tabs={tabs.map((t, i) => {
            let title = filters.getIn([t, 'title']);
            if (filters.getIn([t, 'unread'])) {
              title += ` (${filters.getIn([t, 'unread'])})`;
            }
            return title;
          })}
          tabIndex={this.state.tabIndex}
          hasLoaded={this.state.hasLoaded}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
    token: state.getIn(['connection', 'token']),
    orgId: state.getIn(['me', 'organizations', 0, 'id']),
    filters: state.getIn(['filters', 'notifications']),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  markNotifications: ca.notifications.mark,
  preview: a.links.preview,
  setCollapsed: a.navigation.setCollapsed,
})(HOCDashboard);
