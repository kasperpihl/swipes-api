import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';
import { colors } from '../../utils/globalStyles';
import NotificationItem from './NotificationItem';

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

    return <HOCHeader title="Notifications" />
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
  renderList() {
    const { hasLoaded } = this.state;
    const { notifications } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
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