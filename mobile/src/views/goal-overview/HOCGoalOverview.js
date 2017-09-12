import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { propsOrPop } from 'swipes-core-js/classes/react-utils';
import { dayStringForDate } from 'swipes-core-js/classes/time-utils';
import * as ca from 'swipes-core-js/actions';
import * as a from 'actions';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import HOCHeader from 'HOCHeader';
import { colors, viewSize } from 'globalStyles';
import HOCStepList from './HOCStepList';
import HOCAttachments from './HOCAttachments';

class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      hasLoaded: false,
      showingInfoTab: false,
    };

    propsOrPop(this, 'goal');

    this.closeView = this.closeView.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
    this.onActionPress = this.onActionPress.bind(this);

    setupLoading(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    this.renderActionButtons();

    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillUpdate(nextProps, nextState) {
    LayoutAnimation.easeInEaseOut();

    if (!this.props.isActive && nextProps.isActive || this.state.showingInfoTab !== nextState.showingInfoTab) {
      this.renderActionButtons(nextState.showingInfoTab);
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
  onActionPress(index) {
    console.warn('gets here', index)
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
          actions: [
            { title: 'Delete goal', icon: 'Delete', danger: true },
          ],
          info: [
            { title: 'Milestone', text: mileLbl, icon: mileIcon, actionLabel: mileAct },
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
      this.setState({ tabIndex: index, hasLoaded: false });
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
    const { goal, goalId } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getNumberOfSteps();
    const tabs = [`Steps(${numberOfCompleted}/${totalSteps})`, `Attachments(${goal.get('attachment_order').size})`];

    return (
      <HOCHeader
        title={goal.get('title')}
        tabs={tabs}
        currentTab={this.state.tabIndex}
        delegate={this}
      />
    );
  }
  renderStepList() {
    const { goal, me } = this.props;
    const helper = this.getHelper();

    return (
      <HOCStepList
        goal={goal}
        steps={helper.getOrderedSteps()}
        delegate={this}
        myId={me.get('id')}
        {...this.bindLoading() }
      />
    );
  }
  renderAttachments() {
    const { goal } = this.props;

    return (
      <HOCAttachments
        attachments={goal.get('attachments')}
        attachmentOrder={goal.get('attachment_order')}
        goal={goal}
      />
    );
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderContent() {
    const { tabIndex, hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    if (tabIndex === 0) {
      return this.renderStepList();
    } else if (tabIndex === 1) {
      return this.renderAttachments();
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}
export default connect(mapStateToProps, {
  showModal: a.modals.show,
  toggleInfoTab: a.infotab.showInfoTab,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
})(HOCGoalOverview);
