import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { connect } from 'react-redux';
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
      filter: n => n.get('receiver') && n.get('important'),
    };

    if (props.notifications) {
      this.state.notifications = this.getFilteredNotifications(props.notifications);
    }

    this.onActionButton = this.onActionButton.bind(this);
  }
  componentDidMount() {
    if (this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isActive && this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications !== this.props.notifications) {
      this.setState({ notifications: this.getFilteredNotifications(nextProps.notifications) });
    }
  }
  onActionButton(i) {
    console.log('action!', i);
  }
  openLink(att) {
    const link = att.get('link') || att;
    const service = link.get('service') || link;
    if (att && service.get('type') === 'url') {
      Linking.openURL(service.get('id'));
    }
  }
  getFilteredNotifications(notifications) {
    return notifications.filter(this.state.filter);
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
      n = n.map(n => msgGen.notifications.getNotificationWrapper(n));
    }

    return (
      <View style={styles.container}>
        <Dashboard notifications={n} delegate={this} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.get('notifications'),
    users: state.get('users'),
    goals: state.get('goals'),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {})(HOCDashboard);
