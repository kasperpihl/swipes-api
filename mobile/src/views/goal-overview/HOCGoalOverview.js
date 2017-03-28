import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import Header from '../../components/header/Header';


class HOCGoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };

    this.closeView = this.closeView.bind(this)
  }
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
      this.setState({ tabIndex: index })
    }
  }
  renderHeader() {
    const { goal } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getTotalNumberOfSteps();
    const tabs = ['Activity', `Steps(${numberOfCompleted}/${totalSteps})`, 'Attachments'];
    
    return (
      <Header title={goal.get('title')} tabs={tabs} currentTab={this.state.tabIndex} delegate={this}/>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <FeedbackButton onPress={this.closeView}>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>Go back</Text>
          </View>
        </FeedbackButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: '#333ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  buttonLabel: {
    color: 'white'
  }
});

export default HOCGoalOverview;