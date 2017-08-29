import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import * as ca from '../../../swipes-core-js/actions';
import HOCHeader from '../../components/header/HOCHeader';
import HOCGoalItem from '../goallist/HOCGoalItem';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import Icon from '../../components/icons/Icon';
import RippleButton from '../../components/ripple-button/RippleButton';
import CreateNewItemModal from '../../modals/CreateNewItemModal';
import { colors } from '../../utils/globalStyles';

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
  fabWrapper: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    position: 'absolute',
    bottom: 30,
    right: 15,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class HOCMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Current', 'Completed'],
      tabIndex: 0,
      routeNum: props.lastRoute,
      goals: this.getFilteredGoals(this.props.milestone, this.props.starredGoals),
      hasLoaded: false,
      fabOpen: false
    };

    this.onActionButton = this.onActionButton.bind(this);
    this.renderGoal = this.renderGoal.bind(this);
    this.handleModalState = this.handleModalState.bind(this);
  }
  componentDidMount() {
    this.renderActionButtons();
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillUpdate(nextProps) {
    if (this.state.routeNum === nextProps.lastRoute) {
      this.renderActionButtons();
    }
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
  getFilteredGoals(milestone, starredGoals) {
    const goals = msgGen.milestones.getGoals(milestone);
    let gg = goals.sort((g1, g2) => {
      const g1StarI = starredGoals.indexOf(g1.get('id'));
      const g2StarI = starredGoals.indexOf(g2.get('id'));
      if (g1StarI > g2StarI) {
        return -1;
      }
      if (g2StarI > g1StarI) {
        return 1;
      }
      return 0;
    }).groupBy(g => new GoalsUtil(g).getIsCompleted() ? 'Completed' : 'Current');

    // Make sure there if no current or completed to add an empty list
    gg = gg.set('Current', gg.get('Current') || List());
    gg = gg.set('Completed', gg.get('Completed') || List());
    return gg;
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index, hasLoaded: false });
    }
  }
  onPushStack(goalOverview) {
    const { navPush } = this.props;

    navPush(goalOverview);
  }
  onActionButton(i) {
    const { navPush, milestone } = this.props;

    navPush({
      id: 'PostCreate',
      title: 'Create Post',
      props: {
        context: {
          title: milestone.get('title'),
          id: milestone.get('id'),
        },
      },
    });

  }
  onModalCreateAction(title, assignees, milestoneId ) {
    const { createGoal } = this.props;

    if (title.length > 0) {
      createGoal(title, milestoneId, assignees.toJS()).then((res) => {
        if (res.ok) {
          this.handleModalState()
        }
      });
    }
  }
  handleModalState() {
    const { fabOpen } = this.state;

    if (!fabOpen) {
      this.setState({ fabOpen: true })
    } else {
      this.setState({ fabOpen: false })
    }
  }
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [
        { text: 'Discuss' },
      ],
    });
  }
  renderHeader() {
    const { tabIndex, tabs } = this.state;
    const { milestone } = this.props;

    return (
      <HOCHeader
        title={milestone.get('title')}
        currentTab={tabIndex}
        delegate={this}
        tabs={tabs}
      />
    );
  }
  renderGoal(goal) {
    return <HOCGoalItem goalId={goal.get('id')} delegate={this} />;
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderList() {
    const { tabs, tabIndex, goals, hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    const tab = tabs[tabIndex];
    const goalList = goals.get(tab);

    return (
      <ImmutableVirtualizedList
        key={tab}
        style={styles.list}
        immutableData={goalList}
        renderRow={this.renderGoal}
      />
    );
  }
  renderFAB() {
    const { fabOpen } = this.state;

    if (fabOpen) {
      return undefined;
    }

    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.handleModalState}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    );
  }
  render() {
    const { milestone } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderList()}
        {this.renderFAB()}
        <CreateNewItemModal
          modalState={this.state.fabOpen}
          defAssignees={[this.props.myId]}
          placeholder="Add a new goal to a milestone"
          actionLabel="Add goal"
          milestoneId={milestone.get('id')}
          delegate={this}
        />
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    starredGoals: state.getIn(['me', 'settings', 'starred_goals']),
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCMilestoneOverview);
