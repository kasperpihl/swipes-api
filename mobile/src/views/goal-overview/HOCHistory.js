import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import * as a from '../../actions';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import NotificationItem from '../dashboard/NotificationItem';
import { colors, viewSize } from '../../utils/globalStyles';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
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

class HOCHistory extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hasRendered: false,
      contentHeight: 0,
      containerheight: 0,
    };

    this.lastY = 0;
    this.direction = 'up';
    setupDelegate(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasRendered: true });
    }, 1);

    console.log(viewSize);
  }
  getHelper() {
    const { goal } = this.props;

    return new GoalsUtil(goal);
  }
  openLink(att) {
    const { preview } = this.props;

    preview(att);
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderEvent(event, me, ctx) {
    if (event.get('type') === 'notified') {
      if (event.get('assignees').indexOf(me.get('id')) === -1 && event.get('done_by') !== me.get('id')) {
        return undefined;
      }
    }

    return <NotificationItem notification={event} delegate={ctx} />;
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  renderList() {
    const { hasRendered } = this.state;
    if (!hasRendered) {
      return this.renderListLoader();
    }
    const { goal, me } = this.props;
    const history = goal.get('history');
    const events = history.map((e, i) => msgGen.history.getNotificationWrapperForHistory(goal.get('id'), e)).reverse();

    if (!events) {
      return undefined;
    }

    return (
      <ImmutableVirtualizedList
        ref="listView"
        removeClippedSubviews={false}
        immutableData={events}
        renderRow={event => this.renderEvent(event, me, this)}
        onScroll={window.onScroll}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderList()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
})(HOCHistory);
