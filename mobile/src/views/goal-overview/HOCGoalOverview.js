import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import { viewSize } from '../../utils/globalStyles';
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

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
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
  getHelper() {
    const { goal } = this.props;
    return new GoalsUtil(goal);
  }
  closeView() {
    const { onPopRoute } = this.props;

    onPopRoute();
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index });
    }
  }
  renderHeader() {
    const { goal } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();
    const tabs = ['Activity', `Steps(${numberOfCompleted}/${totalSteps})`, `Attachments(${goal.get('attachment_order').size})`];

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
    const helper = this.getHelper();

    return (
      <HOCStepList
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
  renderContextButton() {
    const { hideButton } = this.state;
    const buttonStyles = hideButton ? styles.buttonHidden : styles.buttonShown;

    return (
      <FeedbackButton onPress={this.closeView}>
        <View style={[styles.button, buttonStyles]}>
          <Text style={styles.buttonLabel}>Go back</Text>
        </View>
      </FeedbackButton>
    );
  }
  renderContent() {
    const { tabIndex } = this.state;

    if (tabIndex === 0) {
      return this.renderActivity();
    }
    // else if (tabIndex === 1) {
    //   return this.renderStepList();
    // } else if (tabIndex === 2) {
    //   return this.renderAttachments();
    // }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.content}>
          {this.renderContent()}
        </View>
        {this.renderContextButton()}
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
  button: {
    width: viewSize.width * 0.6,
    height: 60,
    position: 'absolute',
    left: (viewSize.width / 2) - ((viewSize.width * 0.6) / 2),
    backgroundColor: '#333ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShown: {
    bottom: 30,
  },
  buttonHidden: {
    bottom: -60,
  },
  buttonLabel: {
    color: 'white',
  },
});


function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {

})(HOCGoalOverview);
