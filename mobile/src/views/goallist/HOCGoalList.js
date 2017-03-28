import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import Tabs from 'react-native-tabs';
import Header from '../../components/header/Header';
import { viewSize, colors } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';

class HOCGoalList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: ['current', 'upcoming', 'unstarted'],
      tabIndex: 0,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({tabIndex: index})
    }
  }
  renderHeader() {

    return <Header title="Goal list" tabs={this.state.tabs} currentTab={this.state.tabIndex} delegate={this} />
  }
  renderGoal(gId, filterId, onPopRoute, onPushRoute, sceneProps) {
    return <HOCGoalItem goalId={gId} filterId={filterId} onPopRoute={onPopRoute} onPushRoute={onPushRoute} sceneProps={sceneProps} />
  }
  render() {
    const { filters, onPopRoute, onPushRoute, sceneProps } = this.props;
    const { tabIndex, tabs } = this.state;
    const goals = filters.getIn([ tabs[tabIndex], 'goals']);

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          <ImmutableListView
            immutableData={goals}
            renderRow={(gId) => this.renderGoal(gId, tabs[tabIndex], onPopRoute, onPushRoute, sceneProps)}
          />
        </View>
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
  list: {
    flex: 1
  }
});
function mapStateToProps(state) {
  return {
    filters: state.get('filters'),
  }
}

export default connect(mapStateToProps, {

})(HOCGoalList);
