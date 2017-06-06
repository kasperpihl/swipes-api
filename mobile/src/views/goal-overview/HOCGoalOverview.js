import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as a from '../../actions';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import * as ca from '../../../swipes-core-js/actions';
import HOCHeader from '../../components/header/HOCHeader';
import HOCHistory from './HOCHistory';
import HOCStepList from './HOCStepList';
import HOCAttachments from './HOCAttachments';


class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      routeNum: props.lastRoute,
    };

    this.closeView = this.closeView.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
    this.onModalAskForAction = this.onModalAskForAction.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    this.renderActionButtons();
    console.log('initState', this.state.routeNum);
  }
  componentWillUpdate(nextProps) {
    LayoutAnimation.easeInEaseOut();
    console.log('state', this.state.routeNum);
    console.log('nextProps', nextProps.lastRoute);
    if (this.state.routeNum === nextProps.lastRoute) {
      this.renderActionButtons();
    }
  }
  onComplete(step) {
    const { completeStep, incompleteStep } = this.props;
    const helper = this.getHelper();
    const actionFunc = step.get('completed_at') ? incompleteStep : completeStep;

    actionFunc(helper.getId(), step.get('id'));
  }
  onModalAskForAction(i) {
    const { goal, showModal } = this.props;
    const type = i.get('title').toLowerCase();

    const notify = {
      id: 'Notify',
      title: 'Notify',
      props: {
        goalId: goal.get('id'),
        notify: {
          notification_type: type,
          request: true,
        },
      },
    };

    showModal();
    this.openNotify(notify);
  }
  onActionButton(i) {
    const { goal, showModal } = this.props;

    if (i === 0) {
      const modal = {
        title: 'Ask for',
        onClick: this.onModalAskForAction,
        items: fromJS([
          {
            title: 'Update',
            leftIcon: {
              icon: 'Status',
            },
          },
          {
            title: 'Feedback',
            leftIcon: {
              icon: 'Feedback',
            },
          },
          {
            title: 'Assets',
            leftIcon: {
              icon: 'Assets',
            },
          },
          {
            title: 'Decision',
            leftIcon: {
              icon: 'Decision',
            },
          },
        ]),
      };

      showModal(modal);
    } else if (i === 1) {
      const notify = {
        id: 'Notify',
        title: 'Notify',
        props: {
          goalId: goal.get('id'),
          notify: {
            notification_type: 'default',
          },
        },
      };

      this.openNotify(notify);
    }
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  openNotify(notify) {
    const { navPush } = this.props;

    navPush(notify);
  }
  closeView() {
    const { navPop } = this.props;

    navPop();
  }
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [
        { text: 'Ask for' },
        { text: 'Notify' },
      ],
    });
  }
  renderHeader() {
    const { goal } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getNumberOfSteps();
    const tabs = [`Steps(${numberOfCompleted}/${totalSteps})`, 'Activity', `Attachments(${goal.get('attachment_order').size})`];

    return (
      <HOCHeader
        title={goal.get('title')}
        tabs={tabs}
        currentTab={this.state.tabIndex}
        delegate={this}
      />
    );
  }
  renderActivity() {
    const { goal } = this.props;

    return (
      <HOCHistory goal={goal} delegate={this} />
    );
  }
  renderStepList() {
    const { goal } = this.props;
    const helper = this.getHelper();

    return (
      <HOCStepList
        goal={goal}
        steps={helper.getOrderedSteps()}
        delegate={this}
      />
    );
  }
  renderAttachments() {
    const { goal } = this.props;

    return (
      <HOCAttachments
        attachments={goal.get('attachments')}
        attachmentOrder={goal.get('attachment_order')}
      />
    );
  }
  renderContent() {
    const { tabIndex } = this.state;

    if (tabIndex === 0) {
      return this.renderStepList();
    } else if (tabIndex === 1) {
      return this.renderActivity();
    } else if (tabIndex === 2) {
      return this.renderAttachments();
    }

    return undefined;
  }
  render() {
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
  showModal: a.modals.show,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
})(HOCGoalOverview);
