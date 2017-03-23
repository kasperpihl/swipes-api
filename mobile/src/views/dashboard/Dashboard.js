import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView } from 'react-native';
import NotificationItem from './NotificationItem';
import { colors, viewSize } from '../../utils/globalStyles';
import ImmutableListView from 'react-native-immutable-list-view';
import Header from '../../components/header/Header';

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
    };
  }
  renderHeader() {

    return <Header title="Dashboard" />
  }
  renderNotifications() {
    const {
      notifications,
      delegate,
    } = this.props;

    if (!notifications.size) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Notifications</Text>
          <Text style={styles.emptyStateMessage}>Here you get notified on the newest and latest from your team. Never miss your turn to take action and stay up–to–date with your team's progress.</Text>
        </View>
      );
    }

    return (
      <ImmutableListView
        immutableData={ notifications }
        renderRow = {(rowData) => this.renderRow(rowData, delegate)}
      />
    )
  }
  renderRow(rowData, delegate) {
    return <NotificationItem notification={rowData} delegate={delegate}/>
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderNotifications()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    paddingBottom: 24
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 30,
    color: colors.deepBlue80,
    fontWeight: '700'
  },
  emptyStateMessage: {
    paddingHorizontal: 30,
    marginTop: 15,
    fontSize: 15,
    color: colors.deepBlue30
  }
});

export default Dashboard;
