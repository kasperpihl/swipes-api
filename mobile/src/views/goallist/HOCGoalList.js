import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import Tabs from 'react-native-tabs';
import Header from '../../components/header/Header';
import { viewSize, colors } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';

class HOCGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['current', 'upcoming', 'unstarted'],
      tabIndex: 0,
    };

    this.renderGoal = this.renderGoal.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
  }
  componentDidMount() {
    if (this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.renderActionButtons();
    }
  }
  onPushStack(route) {
    const { navPush } = this.props;

    navPush(route);
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  onActionButton(i) {
    console.log('action!', i);
  }
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [{ text: 'Add a goal' }],
    });
  }
  renderHeader() {
    const { filters } = this.props;
    const { tabIndex, tabs } = this.state;
    const newTabs = [];

    tabs.forEach((t, i) => {
      const goals = filters.getIn([tabs[i], 'goals']);
      const tabName = `${t} (${goals.size})`;

      newTabs.push(tabName);
    });

    return <Header title="Goal list" tabs={newTabs} currentTab={this.state.tabIndex} delegate={this} />;
  }
  renderGoal(gId, filterId) {
    return <HOCGoalItem goalId={gId} filterId={filterId} delegate={this} />;
  }
  renderFooter() {
    return <View style={styles.footer} />;
  }
  render() {
    const { filters, onPopRoute, onPushRoute, sceneProps } = this.props;
    const { tabIndex, tabs } = this.state;
    const goals = filters.getIn([tabs[tabIndex], 'goals']);

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          <ImmutableListView
            immutableData={goals}
            renderRow={gId => this.renderGoal(gId, tabs[tabIndex])}
            renderFooter={this.renderFooter}
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
  },
  list: {
    flex: 1,
  },
  footer: {
    width: viewSize.width,
    height: 112,
  },
});

function mapStateToProps(state) {
  return {
    filters: state.getIn(['filters', 'goals']),
  };
}

export default connect(mapStateToProps, {

})(HOCGoalList);
