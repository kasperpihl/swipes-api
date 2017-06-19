import React, { PureComponent } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import HOCHeader from '../header/HOCHeader';
import { colors } from '../../utils/globalStyles';

const HEADER_MAX_HEIGHT = 121;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  fill: {
    flex: 1,
    paddingTop: HEADER_MAX_HEIGHT,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 9,
  },
});

class CollapsableHeaderView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }
  renderHeader() {
    const { title, tabs, tabIndex, delegate } = this.props.header;

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [0, -HEADER_MAX_HEIGHT],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, { marginTop: headerHeight }]}>
        <HOCHeader title={title} tabs={tabs} currentTab={tabIndex} delegate={delegate} />
      </Animated.View>
    )
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderList() {
    const { data, rowRender, hasLoaded } = this.props.list;

    if (!data || !hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableVirtualizedList
        style={styles.fill}
        immutableData={data}
        renderRow={rowRender}
        rowsDuringInteraction={10}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
        )}
      />
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
      </View>
    );
  }
}

export default CollapsableHeaderView;