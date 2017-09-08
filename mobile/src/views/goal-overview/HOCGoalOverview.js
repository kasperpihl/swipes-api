import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as a from '../../actions';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import { setupLoading } from '../../../swipes-core-js/classes/utils';
import { propsOrPop } from '../../../swipes-core-js/classes/react-utils';
import * as ca from '../../../swipes-core-js/actions';
import HOCHeader from '../../components/header/HOCHeader';
import HOCHistory from './HOCHistory';
import HOCStepList from './HOCStepList';
import HOCAttachments from './HOCAttachments';
import { colors, viewSize } from '../../utils/globalStyles';

class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      hasLoaded: false,
    };

    propsOrPop(this, 'goal');

    this.closeView = this.closeView.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
    this.onModalAskForAction = this.onModalAskForAction.bind(this);

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
  componentWillUpdate(nextProps) {
    LayoutAnimation.easeInEaseOut();
    if (!this.props.isActive && nextProps.isActive) {
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
  onComplete(step) {
    console.log('step', step)
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
    const { goal, navPush } = this.props;
    const helper = this.getHelper();

    navPush({
      id: 'PostCreate',
      title: 'Create Post',
      props: {
        context: {
          title: goal.get('title'),
          id: goal.get('id'),
        },
        taggedUsers: helper.getAllAssigneesButMe().toArray()
      },
    });

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
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [
        { text: 'Discuss' },
      ],
    });
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
  renderActivity() {
    const { goal } = this.props;

    return (
      <HOCHistory goal={goal} delegate={this} />
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
  loader: {

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
