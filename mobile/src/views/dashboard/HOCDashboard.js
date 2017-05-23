import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as a from '../../actions';
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
      tabs: ['received', 'sent', 'activity'],
      tabIndex: 0,
      hasLoaded: false,
    };

    this.onActionButton = this.onActionButton.bind(this);
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
    if (!this.state.hasLoaded) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }

    if (!prevProps.isActive && this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
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
  onActionButton(i) {
    // console.log('action!', i);
  }
  onNotificationPress(obj) {
    const { navPush } = this.props;
    const { notifications } = this.state;
    const notification = notifications.get(obj.get('i'));
    const overview = {
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId: notification.getIn(['target', 'id']),
      },
    };

    navPush(overview);
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
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [{ text: 'Mark All as Read' }],
    });
  }
  render() {
    const { filters } = this.props;
    let { notifications: n, tabs } = this.state;

    if (n) {
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
  preview: a.links.preview,
})(HOCDashboard);
