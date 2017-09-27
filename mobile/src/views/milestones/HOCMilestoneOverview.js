import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ImmutableListView } from 'react-native-immutable-list-view';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { propsOrPop } from 'swipes-core-js/classes/react-utils';
import { dayStringForDate } from 'swipes-core-js/classes/time-utils';
import { bindAll } from 'swipes-core-js/classes/utils';
import HOCHeader from 'HOCHeader';
import WaitForUI from 'WaitForUI';
import HOCGoalItem from 'views/goallist/HOCGoalItem';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Icon from 'Icon';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import RippleButton from 'RippleButton';
import CreateNewItemModal from 'modals/CreateNewItemModal';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 11,
    color: colors.deepBlue100,
    fontWeight: 'bold', 
  },
  emptyText: {
    fontSize: 12,
    color: colors.deepBlue40,
    lineHeight: 18,
    textAlign: 'center',
    paddingTop: 9,
  },
});

class HOCMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Current', 'Later', 'Completed'],
      tabIndex: 0,
      showingInfoTab: false,
    };

    propsOrPop(this, 'milestone');
    bindAll(this, ['onActionButton', 'renderGoal', 'openCreateGoalModal', 'onHeaderTap', 'onActionPress', 'onInfoTabClose',]);
  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentWillUpdate(nextProps, nextState) {

    if (!this.props.isActive && nextProps.isActive || this.state.showingInfoTab !== nextState.showingInfoTab) {
      this.renderActionButtons(nextState.showingInfoTab);
    }
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  onPushStack(goalOverview) {
    const { navPush } = this.props;

    navPush(goalOverview);
  }
  onActionPress(index) {
    const { milestone, openMilestone, closeMilestone, deleteMilestone, toggleInfoTab } = this.props;

    if (index === 0) {
      if (milestone.get('closed_at')) {
        openMilestone(milestone.get('id'));
        toggleInfoTab();
      } else {
        closeMilestone(milestone.get('id'));
        toggleInfoTab();
      }

    } else if (index === 1) {
      Alert.alert(
        'Delete plan',
        'This will delete this plan and all goals in it. Are you sure?',
        [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          { text: 'OK', onPress: () => { deleteMilestone(milestone.get('id')); toggleInfoTab(); } },
        ],
        { cancelable: true },
      );
    }
  }
  onInfoTabClose() {
    if (this.state.showingInfoTab) {
      this.setState({ showingInfoTab: false });
    }
  }
  onActionButton(i) {
    const { navPush, milestone, toggleInfoTab } = this.props;
    const { showingInfoTab } = this.state;

    if (showingInfoTab) {
      if (i === 0) {
        toggleInfoTab();
        this.setState({ showingInfoTab: false })
      }
    } else {
      if (i === 0) {
        navPush({
          id: 'PostFeed',
          title: 'Discussions',
          props: {
            context: {
              title: milestone.get('title'),
              id: milestone.get('id'),
            },
            relatedFilter: msgGen.milestones.getRelatedFilter(milestone)
          },
        });
      } else if (i === 1) {
        let achieveLbl = 'Mark plan as achieved';
        let achieveIcon = 'MilestoneAchieve';
        let complete = true;
        if (milestone.get('closed_at')) {
          complete = false,
          achieveIcon = 'Milestone';
          achieveLbl = 'Move plan to current';
        }
        const createdLbl = `${dayStringForDate(milestone.get('created_at'))} by ${msgGen.users.getFullName(milestone.get('created_by'))}`
        this.setState({ showingInfoTab: true });

        toggleInfoTab({
          onPress: this.onActionPress,
          onClose: this.onInfoTabClose,
          actions: [
            { title: achieveLbl, complete, icon: achieveIcon },
            { title: 'Delete plan', icon: 'Delete', danger: true },
          ],
          info: [
            { title: 'Created', text: createdLbl },
          ],
          about: {
            title: 'What is a plan',
            text: 'A Plan is where everything begins. It is a project, objective or ongoing activity. You can add goals to reach a Plan.\n\nTo keep your work organized, categorize goals for your Plan with This week, Later or Completed.'
          },
        })
      }
    }
  }
  onModalCreateAction(title, assignees, milestoneId ) {
    const { createGoal } = this.props;

    if (title.length > 0) {
      createGoal(title, milestoneId, assignees.toJS()).then((res) => {});
      this.setState({ tabIndex: 0 });
    }
  }
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
  }
  openCreateGoalModal() {
    const { navPush, milestone } = this.props;

    navPush({
      id: 'CreateNewItemModal',
      title: 'CreateNewItemModal',
      props: {
        title: '',
        defAssignees: [this.props.myId],
        placeholder: "Add a new goal to a plan",
        actionLabel: "Add goal",
        milestoneId: milestone.get('id'),
        delegate: this
      }
    })
  }
  renderActionButtons(showingInfoTab) {

    if (showingInfoTab) {
      this.props.setActionButtons({
        onClick: this.onActionButton,
        buttons: [
          { icon: 'Close', seperator: 'left', staticSize: true, alignEnd: true }
        ],
        hideBackButton: true,
      });
    } else {
      this.props.setActionButtons({
        onClick: this.onActionButton,
        buttons: [
          { text: 'Discussions' },
          { icon: 'Info', seperator: 'left', staticSize: true }
        ],
      });
    }
  }
  renderHeader() {
    const { tabIndex, tabs } = this.state;
    const { milestone } = this.props;

    return (
      <HOCHeader
        title={milestone.get('title')}
        currentTab={tabIndex}
        delegate={this}
        tabs={tabs.map((t, i) => i === 0 ? 'This week' : t)}
        icon="Milestones"
      />
    );
  }
  renderGoal(goal) {
    return <HOCGoalItem goalId={goal.get('id')} delegate={this} />;
  }
  renderListFooter() {
    return <EmptyListFooter />
  }
  renderEmptyState(group) {
    let title;
    let text;
    
    if (group === 'Current') {
      title = 'Add a new goal';
      text = 'Add new goals for everything that needs \n to be done to achieve this plan.';
    } else if (group === 'Later') {
      title = 'set for later (coming soon)';
      text = 'Move goals that need to be done later \n from this week into here.';
    } else if (group === 'Completed') {
      title = 'TRACK PROGRESS';
      text = 'You will see the progress of all completed \n goals here';
    }

    return (
      <View style={styles.emptyState}>
        <Text selectable={true} style={styles.emptyTitle}>{title.toUpperCase()}</Text>
        <Text selectable={true} style={styles.emptyText}>{text}</Text>
      </View>
    )    
  }
  renderList() {
    const { tabs, tabIndex } = this.state;
    const { groupedGoals } = this.props;
    const tab = tabs[tabIndex];
    const goalList = groupedGoals.get(tab);

    if (!goalList.size) {
      return this.renderEmptyState(tab)
    }

    return (
      <WaitForUI waitIndex={tabIndex}>
        <ImmutableListView
          ref="scrollView"
          key={tab}
          style={styles.list}
          immutableData={goalList}
          renderRow={this.renderGoal}
          renderFooter={this.renderListFooter}
        />
      </WaitForUI>
    );
  }
  renderFAB() {
    const { fabOpen } = this.state;

    if (fabOpen) {
      return undefined;
    }

    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.openCreateGoalModal}>
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
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
    groupedGoals: cs.milestones.getGroupedGoals(state, ownProps),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
  toggleInfoTab: a.infotab.showInfoTab,
  closeMilestone: ca.milestones.close,
  openMilestone: ca.milestones.open,
  deleteMilestone: ca.milestones.deleteMilestone,
})(HOCMilestoneOverview);
