import React, { PureComponent } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { propsOrPop } from 'swipes-core-js/classes/react-utils';
import { dayStringForDate } from 'swipes-core-js/classes/time-utils';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import * as a from 'actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCHeader from 'HOCHeader';
import WaitForUI from 'WaitForUI';
import { colors, viewSize } from 'globalStyles';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import HOCStepList from './HOCStepList';
import HOCAttachments from './HOCAttachments';
import AssigneesList from './AssigneesList';

class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      showingInfoTab: false,
    };

    propsOrPop(this, 'goal');

    this.closeView = this.closeView.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
    this.onActionPress = this.onActionPress.bind(this);
    this.onInfoTabClose = this.onInfoTabClose.bind(this);
    this.onArchive = this.onArchive.bind(this);
    this.handleCompleteGoal = this.handleCompleteGoal.bind(this);

    setupLoading(this);
  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentWillUpdate(nextProps, nextState) {
    if (!this.props.isActive && nextProps.isActive || this.state.showingInfoTab !== nextState.showingInfoTab) {
      this.renderActionButtons(nextState.showingInfoTab);
    }
  }
  onModalAssign(selectedIds) {
    const { assignGoal, goal } = this.props;

    assignGoal(goal.get('id'), selectedIds.toJS())
  }
  handleCompleteGoal() {
    const { incompleteGoal, completeGoal } = this.props;
    const helper = this.getHelper();
    const actionFunc = helper.getIsCompleted() ? incompleteGoal : completeGoal;

    this.setLoading('completing');

    actionFunc((helper.getId())).then((res) => {
      if (res && res.ok) {
        this.clearLoading('completing');
      } else {
        this.clearLoading('completing', '!Something went wrong');
      }
    })
  }
  handleAssigning() {
    const {  assignModal, goal, toggleInfoTab } = this.props;
    this.setState({ showingInfoTab: false })
    toggleInfoTab();

    assignModal({
      selectedIds: goal.get('assignees'),
      onActionPress: (selectedIds) => this.setState({assignees: selectedIds}),
    });
  }
  onActionPress(index) {
    const { alertModal } = this.props;
    if (index === 0) {
      this.handleAssigning()
    }

    if (index === 1) {
      alertModal({
        title: 'Delete goal',
        message: 'This will remove this goal for all participants.',
        onConfirmPress: this.onArchive,
      })
    }
  }
  onInfoTabClose() {
    if (this.state.showingInfoTab) {
      this.setState({ showingInfoTab: false });
    }
  }
  onArchive() {
    const { archive, goal, toggleInfoTab, navPop } = this.props;

    if (this.state.showingInfoTab) {
      this.setState({ showingInfoTab: false })
      toggleInfoTab();
      navPop();
      archive(goal.get('id'));
    }
  }
  onComplete(step) {
    if (this.isLoading(step.get('id'))) {
      return;
    }
    const { completeStep, incompleteStep } = this.props;
    const helper = this.getHelper();
    const actionFunc = step.get('completed_at') ? incompleteStep : completeStep;
    const loadingLabel = step.get('completed_at') ? 'Incompleting...' : 'Completing...';
    this.setLoading(step.get('id'), loadingLabel);

    actionFunc(helper.getId(), step.get('id')).then((res) => {
      if (res && res.ok) {
        this.clearLoading(step.get('id'));
      } else {
        this.clearLoading(step.get('id'), '!Something went wrong', 3000);
      }
    });
  }
  onActionButton(i) {
    const { goal, navPush, toggleInfoTab } = this.props;
    const { showingInfoTab } = this.state;
    const helper = this.getHelper();

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
              title: goal.get('title'),
              id: goal.get('id'),
            },
            relatedFilter: msgGen.goals.getRelatedFilter(goal)
          },
        }); 
      } else if (i === 1) {
        const createdLbl = `${dayStringForDate(goal.get('created_at'))} by ${msgGen.users.getFullName(goal.get('created_by'))}`;
        const mileLbl = msgGen.milestones.getName(goal.get('milestone_id'));
        const mileIcon = goal.get('milestone_id') ? 'MiniMilestone' : 'MiniNoMilestone';
        const mileAct = goal.get('milestone_id') ? 'edit' : 'add';
        this.setState({ showingInfoTab: true })

        toggleInfoTab({
          onPress: this.onActionPress,
          onClose: this.onInfoTabClose,
          actions: [
            { title: 'Reassign goal', icon: 'Person' },
            { title: 'Delete goal', icon: 'Delete', danger: true },
          ],
          info: [
            { title: 'Plan', text: mileLbl, icon: mileIcon, actionLabel: mileAct },
            { title: 'Created', text: createdLbl },
          ],
          about: {
            title: 'What is a goal',
            text: 'A Goal is where work happens. Something needs to be done or delivered. Goals can be broken down into steps to show the next action.\n\nAll important links, documents, and notes can be attached to the goal so everyone is on the same page. You can discuss a goal or post an update via "Discuss".',
          },
        })
      }
    }
  }
  onChangeTab(index) {
    const { hasLoaded } = this.state;

    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  closeView() {
    const { navPop } = this.props;

    navPop();
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
  renderGoalComplete() {
    
    if (this.isLoading('completing')) {
      return (
        <View style={{width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 5 }}>
          <ActivityIndicator color={colors.greenColor} size='small' />
        </View>
      )
    }

    const helper = this.getHelper();
    const isCompleted = helper.getIsCompleted();
    let extraStyles = {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.deepBlue50,
    };

    if (isCompleted) {
      extraStyles = {
        backgroundColor: colors.greenColor,
        borderWidth: 2,
        borderColor: colors.greenColor,
      }
    }

    return (
      <RippleButton onPress={this.handleCompleteGoal}>
        <View style={[ extraStyles, { width: 36, height: 36, borderRadius: 36 / 2, marginRight: 12, marginTop: 5, paddingHorizontal: 4, paddingVertical: 4 }]}>
          <Icon name="ChecklistCheckmark" width="18" height="18" fill="white" />
        </View>
      </RippleButton>
    )
  }
  renderHeader() {
    const { goal, goalId } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getNumberOfSteps();
    const tabs = [`Steps(${numberOfCompleted}/${totalSteps})`, `Attachments(${goal.get('attachment_order').size})`, `Assignees(${goal.get('assignees').size})`];

    return (
      <HOCHeader
        title={goal.get('title')}
        tabs={tabs}
        currentTab={this.state.tabIndex}
        delegate={this}
        headerAction={this.renderGoalComplete()}
      />
    );
  }
  renderStepList() {
    const { goal, me, navPush } = this.props;
    const helper = this.getHelper();

    return (
      <WaitForUI>
        <HOCStepList
          goal={goal}
          steps={helper.getOrderedSteps()}
          delegate={this}
          myId={me.get('id')}
          navPush={navPush}
          {...this.bindLoading() }
        />
      </WaitForUI>
    );
  }
  renderAttachments() {
    const { goal } = this.props;

    return (
      <WaitForUI>
        <HOCAttachments
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          goal={goal}
        />
      </WaitForUI>
    );
  }
  renderAssignees() {
    const { goal } = this.props;

    return (
      <WaitForUI>
        <AssigneesList
          assignees={goal.get('assignees')}
        />
      </WaitForUI>
    )
  }
  renderContent() {
    const { tabIndex, hasLoaded } = this.state;

    if (tabIndex === 0) {
      return this.renderStepList();
    } else if (tabIndex === 1) {
      return this.renderAttachments();
    } else if (tabIndex === 2) {
      return this.renderAssignees()
    }

    return undefined;
  }
  render() {
    const { goal } = this.props;
    const { tabIndex } = this.state;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.content} key={tabIndex} >
          {this.renderContent()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
});


function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}
export default connect(mapStateToProps, {
  assignModal: a.modals.assign,
  alertModal: a.modals.alert,
  toggleInfoTab: a.infotab.showInfoTab,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
  completeGoal: ca.goals.complete,
  incompleteGoal: ca.goals.incomplete,
  archive: ca.goals.archive,
  assignGoal: ca.goals.assign,
})(HOCGoalOverview);
