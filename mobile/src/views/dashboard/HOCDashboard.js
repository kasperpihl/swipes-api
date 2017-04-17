import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
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
    this.onModal = this.onModal.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
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
      setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }

    if (!prevProps.isActive && this.props.isActive) {
      this.renderActionButtons();
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
  onActionButton(i) {
    // console.log('action!', i);
  }
  onModal(i, props) {
    const { showModal, navPush } = this.props;

    if (i === 0) {
      const overview = {
        id: 'GoalOverview',
        title: 'Goal overview',
        props: {
          goalId: props.goalId,
        },
      };
      showModal();
      navPush(overview);
    } else if (i === 1) {
      const notify = {
        id: 'Notify',
        title: 'Notify',
        props: {
          title: 'Reply',
          goalId: props.goalId,
        },
      };
      showModal();
      navPush(notify);
    }
  }
  onNotificationPress(obj) {
    const { showModal, navPush } = this.props;
    const { notifications } = this.state;
    const notification = notifications.get(obj.get('i'));

    if (obj.get('reply')) {
      const modal = {
        title: 'Choose an Action',
        onClick: this.onModal,
        actions: [
          {
            title: `Open ${notification.getIn(['meta', 'title'])}`,
            props: {
              goalId: notification.getIn(['target', 'id']),
            },
          },
          {
            title: `Reply to ${msgGen.users.getName(notification.get('done_by'))}`,
            props: {
              goalId: notification.getIn(['target', 'id']),
            },
          },
        ],
      };

      showModal(modal);
    } else {
      const overview = {
        id: 'GoalOverview',
        title: 'Goal overview',
        props: {
          goalId: notification.getIn(['target', 'id']),
        },
      };

      navPush(overview);
    }
  }
  openLink(att) {
    const link = att.get('link') || att;
    const service = link.get('service') || link;
    if (att && service.get('type') === 'url') {
      Linking.openURL(service.get('id'));
    }
  }
  getFilteredNotifications(fI, notifications, filters) {
    notifications = notifications || this.props.notifications;
    filters = filters || this.props.filters;
    const filterId = this.state.tabs[fI];

    return filters.getIn([filterId, 'notifications']).map(i => notifications.get(i));
  }
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [{ text: 'Mark All as Read' }],
    });
  }
  render() {
    let { notifications: n } = this.state;

    if (n) {
      n = n.map((n, i) => msgGen.notifications.getNotificationWrapper(n).set('i', i));
    }


    return (
      <View style={styles.container}>
        <Dashboard
          notifications={n}
          delegate={this}
          tabs={this.state.tabs}
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
    filters: state.getIn(['filters', 'notifications']),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  showModal: a.modals.showModal,
})(HOCDashboard);
