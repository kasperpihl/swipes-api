import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import { setupDelegate } from 'react-delegate';
import { colors } from 'globalStyles';
import HOCHeader from 'HOCHeader';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import InteractionsHandlerWrapper from 'InteractionsHandlerWrapper';
import NotificationItem from './NotificationItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
});

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {};

    this.renderNotifications = this.renderNotifications.bind(this);
    setupDelegate(this, 'onMarkAll');
  }
  renderHeader() {

    return (
      <HOCHeader title="Notifications">
        <RippleButton onPress={this.onMarkAll}>
          <View style={{ height: 44, paddingHorizontal: 6, alignItems: 'center', flexDirection: 'row' }}>
            <Text selectable={true} style={{ fontSize: 13, color: colors.deepBlue50 }}>Mark all as read</Text>
          </View>
        </RippleButton>
      </HOCHeader>
    )
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderNotifications(n) {
    const { delegate } = this.props;

    return <NotificationItem notification={n} delegate={delegate} />
  }
  renderEmptyState() {

    return (
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'column' }}>
        <Icon name="ESNotification" width="290" height="300"  />
        <Text selectable={true} style={{ fontSize: 15, lineHeight: 21, color: colors.deepBlue50, paddingTop: 24, textAlign: 'center'  }}>You will be notified here when{"\n"} there’s something new.</Text>
      </View>
    )
  }
  renderList() {
    const { notifications } = this.props;

    if (!notifications || !notifications.size) {
      return this.renderEmptyState();
    }

    return (
      <InteractionsHandlerWrapper>
        <ImmutableVirtualizedList
          style={styles.list}
          immutableData={notifications}
          renderRow={this.renderNotifications}
          onScroll={window.onScroll}
        />
      </InteractionsHandlerWrapper>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          {this.renderList()}
        </View>
      </View>
    );
  }
}

export default Notifications
// const { string } = PropTypes;
Notifications.propTypes = {};
