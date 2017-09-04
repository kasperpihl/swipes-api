import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { ImmutableListView } from 'react-native-immutable-list-view';
import * as ca from '../../../swipes-core-js/actions';
import * as cs from '../../../swipes-core-js/selectors';
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
      hasLoaded: false,
      fabOpen: false
    };

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
    const { tabs, tabIndex, hasLoaded } = this.state;
    const { groupedGoals } = this.props;
    
    // if (!hasLoaded) {
    //   return this.renderListLoader();
    // }

    const tab = tabs[tabIndex];
    const goalList = groupedGoals.get(tab);

    return (
      <ImmutableListView
        ref="scrollView"
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
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
    groupedGoals: cs.milestones.getGroupedGoals(state, ownProps),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCMilestoneOverview);
