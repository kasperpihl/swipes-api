import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import NotificationItem from './NotificationItem';
import { colors, viewSize } from '../../utils/globalStyles';
import ImmutableListView from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  renderHeader() {
    return (
      <HOCHeader
        title="Dashboard"
        tabs={this.props.tabs}
        currentTab={this.props.tabIndex}
        delegate={this.props.delegate}
      />
    );
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderNotifications() {
    const {
      notifications,
      delegate,
      hasLoaded,
    } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

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
        immutableData={notifications}
        renderRow={rowData => this.renderRow(rowData, delegate)}
        renderFooter={this.renderFooter}
        removeClippedSubviews={false}
      />
    );
  }
  renderRow(rowData, delegate) {
    return <NotificationItem notification={rowData} delegate={delegate} />;
  }
  renderFooter() {
    return <EmptyListFooter />;
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
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 30,
    color: colors.deepBlue80,
    fontWeight: '700',
  },
  emptyStateMessage: {
    paddingHorizontal: 30,
    marginTop: 15,
    fontSize: 15,
    color: colors.deepBlue30,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: -60,
  },
});

export default Dashboard;
