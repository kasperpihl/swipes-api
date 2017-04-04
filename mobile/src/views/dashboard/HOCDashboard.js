import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { timeAgo } from '../../../swipes-core-js/classes/time-utils';
import { viewSize } from '../../utils/globalStyles';
import Dashboard from './Dashboard';
import InternalWebview from '../webview/InternalWebview';
import HOCGoalList from '../goallist/HOCGoalList';


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
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications !== this.props.notifications) {
      this.setState({ notifications: this.getFilteredNotifications(nextProps.notifications) });
    }
  }
  openLink(att) {
    const { onPushRoute } = this.props;
    const link = att.get('link') || att;
    const service = link.get('service') || link;
    if (att && service.get('type') === 'url') {
      // Using linking instead of webview at the moment;

      Linking.openURL(service.get('id'));

      // const webView = {
      //   component: InternalWebview,
      //   title: service.get('id'),
      //   key: service.get('id'),
      //   props: {
      //     url: service.get('id'),
      //     title: service.get('id')
      //   }
      // };

      // onPushRoute(webView);
    }
  }
  getFilteredNotifications(notifications) {
    return notifications.filter(this.state.filter);
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
