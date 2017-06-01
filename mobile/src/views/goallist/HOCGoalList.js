import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';
import { colors } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';

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


class HOCGoalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['current', 'starred', 'unassigned'],
      tabIndex: 0,
      hasLoaded: false,
    };

    this.renderGoal = this.renderGoal.bind(this);
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasLoaded) {
      clearTimeout(this.loadingTimeout);

      this.loadingTimeout = setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
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
  renderHeader() {
    const { filters } = this.props;
    const { tabIndex, tabs } = this.state;

    return (
      <HOCHeader
        title="Goals"
        tabs={tabs.map((tId, i) => {
          let title = filters.getIn([tId, 'title']);
          const size = filters.getIn([tId, 'goals']).size;
          if (i < (tabs.length - 1) && size) {
            title += ` (${size})`;
          }
          return title;
        })}
        currentTab={tabIndex}
        delegate={this}
      />
    );
  }
  renderGoal(gId, filterId) {
    return <HOCGoalItem goalId={gId} key={gId} delegate={this} />;
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
    const { filters, goals, starredGoals: pG } = this.props;
    const { tabIndex, tabs, hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    let goalFilter = filters.get(tabs[tabIndex]);

    goalFilter = goalFilter.set('goals', goalFilter.get('goals').sort((g1, g2) => {
      const g1PinI = pG.indexOf(g1);
      const g2PinI = pG.indexOf(g2);

      if (g1PinI > g2PinI) {
        return -1;
      }

      if (g2PinI > g1PinI) {
        return 1;
      }

      return goals.getIn([g2, 'created_at']).localeCompare(goals.getIn([g1, 'created_at']));
    }));

    return (
      <ImmutableListView
        style={styles.list}
        immutableData={goalFilter.get('goals')}
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

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    filters: state.getIn(['filters', 'goals']),
    starredGoals: state.getIn(['me', 'settings', 'starred_goals']),
  };
}

export default connect(mapStateToProps, {

})(HOCGoalList);
