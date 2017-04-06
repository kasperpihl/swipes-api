import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Linking, Dimensions, ActivityIndicator } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import NotificationItem from '../dashboard/NotificationItem';
import { colors } from '../../utils/globalStyles';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';

const { width: ww, height: wh } = Dimensions.get('window');

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
    this.callDelegate = setupDelegate(props.delegate);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleContentSizeChange = this.handleContentSizeChange.bind(this);
    this.getContainerHeight = this.getContainerHeight.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasRendered: true });
    }, 1);
  }
  componentWillUnmount() {
    this.callDelegate('onDirectionChange', 'up');
  }
  getContainerHeight(containerheight) {
    this.setState({ containerheight: containerheight.height });
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  handleContentSizeChange(cw, ch) {
    this.setState({ contentHeight: ch });
  }
  handleScroll(event) {
    let currentOffset = Math.max(0, event.nativeEvent.contentOffset.y);
    currentOffset = Math.min(this.state.contentHeight - this.state.containerheight, currentOffset);
    let direction = 'up';

    if (currentOffset >= this.lastY && currentOffset !== 0) {
      direction = 'down';
    }

    if (direction !== this.direction) {
      this.callDelegate('onDirectionChange', direction);
      this.direction = direction;
    }

    this.lastY = currentOffset;
  }
  openLink(att) {
    const link = att.get('link') || att;
    const service = link.get('service') || link;
    if (att && service.get('type') === 'url') {
      Linking.openURL(service.get('id'));
    }
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
      <ImmutableListView
        ref="listView"
        onContentSizeChange={(contentWidth, contentHeight) => this.handleContentSizeChange(contentWidth, contentHeight)}
        onScroll={this.handleScroll}
        scrollEventThrottle={0}
        removeClippedSubviews={false}
        immutableData={events}
        renderRow={event => this.renderEvent(event, me, this)}
        renderFooter={this.renderFooter}
      />
    );
  }
  render() {
    return (
      <View style={styles.container} onLayout={e => this.getContainerHeight(e.nativeEvent.layout)}>
        {this.renderList()}
      </View>
    );
  }
}

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

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCHistory);
