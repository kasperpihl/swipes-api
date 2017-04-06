import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import Header from '../../components/header/Header';
import HOCHistory from './HOCHistory';
import HOCStepList from './HOCStepList';
import HOCAttachments from './HOCAttachments';


class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      hideButton: false,
    };

    this.closeView = this.closeView.bind(this);
    this.onActionButton = this.onActionButton.bind(this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    if (this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  // onDirectionChange(direction) {
  //   const { hideButton } = this.state;
  //   const newHideButton = (direction === 'down');
  //   if (hideButton !== newHideButton) {
  //     this.setState({ hideButton: newHideButton });
  //   }
  // }
  openNotify() {
    const { navPush, goal } = this.props;

    const notify = {
      id: 'Notify',
      props: {
        title: 'Ask for',
        goalId: goal.get('id'),
      },
    };

    navPush(notify);
  }
  onActionButton(i) {
    if (i === 0) {
      this.openNotify();
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
  closeView() {
    const { navPop } = this.props;

    navPop();
  }
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [
        { text: 'Ask for' },
        { text: 'Give' },
      ],
    });
  }
  renderHeader() {
    const { goal } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();
    const tabs = [`Steps(${numberOfCompleted}/${totalSteps})`, 'Activity', `Attachments(${goal.get('attachment_order').size})`];

    return (
      <Header title={goal.get('title')} tabs={tabs} currentTab={this.state.tabIndex} delegate={this} />
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
        completed={helper.getNumberOfCompletedSteps()}
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
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.content}>
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


function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {

})(HOCGoalOverview);
