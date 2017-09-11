import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ImmutableListView } from 'react-native-immutable-list-view';
import * as ca from '../../../swipes-core-js/actions';
import * as cs from '../../../swipes-core-js/selectors';
import { propsOrPop } from '../../../swipes-core-js/classes/react-utils';
import HOCHeader from '../../components/header/HOCHeader';
import HOCGoalItem from '../goallist/HOCGoalItem';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import Icon from '../../components/icons/Icon';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';
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
      hasLoaded: false,
      fabOpen: false
    };

    propsOrPop(this, 'milestone');

    this.onActionButton = this.onActionButton.bind(this);
    this.renderGoal = this.renderGoal.bind(this);
    this.handleModalState = this.handleModalState.bind(this);
    this.onHeaderTap = this.onHeaderTap.bind(this);
  }
  componentDidMount() {
    this.renderActionButtons();
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillUpdate(nextProps) {
    console.log('props', this.props.isActive);
    console.log('nextProps', nextProps.isActive);

    if (!this.props.isActive && nextProps.isActive) {
      console.log('render buttons')
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
  onHeaderTap() {
    this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
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
        { text: 'Discussions' },
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
        tabs={tabs.map((t, i) => i === 0 ? 'This week' : t)}
        icon="Milestones"
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
  renderListFooter() {

    return <EmptyListFooter />
  }
  renderEmptyState(group) {
    let title;
    let text;
    
    if (group === 'Current') {
      title = 'Add a new goal';
      text = 'Add new goals for everything that needs \n to be done to achieve this milestone.';
    } else if (group === 'Later') {
      title = 'set for later (coming soon)';
      text = 'Move goals that need to be done later \n from this week into here.';
    } else if (group === 'Completed') {
      title = 'TRACK PROGRESS';
      text = 'You will see the progress of all completed \n goals here';
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{title.toUpperCase()}</Text>
        <Text style={styles.emptyText}>{text}</Text>
      </View>
    )    
  }
  renderList() {
    const { tabs, tabIndex, hasLoaded } = this.state;
    const { groupedGoals } = this.props;
    
    if (!hasLoaded) {
      return this.renderListLoader();
    }

    const tab = tabs[tabIndex];
    const goalList = groupedGoals.get(tab);

    if (!goalList.size) {
      return this.renderEmptyState(tab)
    }

    return (
      <ImmutableListView
        ref="scrollView"
        key={tab}
        style={styles.list}
        immutableData={goalList}
        renderRow={this.renderGoal}
        renderFooter={this.renderListFooter}
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
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
    groupedGoals: cs.milestones.getGroupedGoals(state, ownProps),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCMilestoneOverview);
