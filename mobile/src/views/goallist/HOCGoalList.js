import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import Header from '../../components/header/Header';
import { colors } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';

class HOCGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['current', 'upcoming', 'unstarted'],
      tabIndex: 0,
      hasLoaded: false,
    };

    this.renderGoal = this.renderGoal.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);

    if (this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasLoaded) {
      setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }
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
      this.setState({ tabIndex: index, hasLoaded: false });
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
    return <EmptyListFooter />;
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderList() {
    const { tabIndex, tabs, hasLoaded } = this.state;
    const { filters } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    const goals = filters.getIn([tabs[tabIndex], 'goals']);

    return (
      <ImmutableListView
        immutableData={goals}
        renderRow={gId => this.renderGoal(gId, tabs[tabIndex])}
        renderFooter={this.renderFooter}
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
  loader: {
    marginTop: -60,
  },
});

function mapStateToProps(state) {
  return {
    filters: state.getIn(['filters', 'goals']),
  };
}

export default connect(mapStateToProps, {

})(HOCGoalList);
