import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import HOCHeader from 'HOCHeader';
import { colors } from 'globalStyles';
import NotificationItem from './NotificationItem';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import { setupDelegate } from 'react-delegate';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Notifications extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasLoaded: false,
    };

    this.renderNotifications = this.renderNotifications.bind(this);
    setupDelegate(this, 'onMarkAll');
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  renderHeader() {

    return (
      <HOCHeader title="Notifications">
        <RippleButton onPress={this.onMarkAll}>
          <View style={{ height: 44, paddingHorizontal: 6, alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{ fontSize: 13, color: colors.deepBlue50 }}>Mark all as read</Text>
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
        <Text style={{ fontSize: 15, lineHeight: 21, color: colors.deepBlue50, paddingTop: 24, textAlign: 'center'  }}>You will be notified here when{"\n"} there’s something new.</Text>
      </View>
    )
  }
  renderList() {
    const { hasLoaded } = this.state;
    const { notifications } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    if (!notifications || !notifications.size) {
      return this.renderEmptyState();
    }

    return (
      <ImmutableVirtualizedList
        style={styles.list}
        immutableData={notifications}
        renderRow={this.renderNotifications}
        onScroll={window.onScroll}
      />
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
