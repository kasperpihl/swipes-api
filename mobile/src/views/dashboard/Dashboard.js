import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import NotificationItem from './NotificationItem';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import { colors } from '../../utils/globalStyles';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    setupDelegate(this);
    this.callDelegate.bindAll('onCollapse');
    this.renderRow = this.renderRow.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  handleScroll(sE) {
    const posY = sE.nativeEvent.contentOffset.y;
    if (posY > 200) {
      this.onCollapse(true);
    }
  }
  renderHeader() {
    return (
      <HOCHeader
        title="Messages"
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
      <ImmutableVirtualizedList
        immutableData={notifications}
        renderRow={this.renderRow}
        rowsDuringInteraction={10}
        removeClippedSubviews={false}
        onScroll={this.handleScroll}
      />
    );
  }
  renderRow(n) {
    const { delegate, tabIndex } = this.props;

    return <NotificationItem notification={n} delegate={delegate} />;
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
