import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FeedbackButton from '../../components/feedback-button/FeedbackButton';
import NewChildView from '../child/ChildView';

class ChildView extends Component {
  constructor(props) {
    super(props)
    this.state = {};

    this.openChildView = this.openChildView.bind(this);
    this.closeChildView = this.closeChildView.bind(this);
  }
  openChildView() {
    const { onPushRoute } = this.props;
    const stepView = { component: NewChildView, title: 'Step View', key: 'StepView-2' };

    onPushRoute(stepView);
  }
  closeChildView() {
    const { onPopRoute } = this.props;

    onPopRoute();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>ChildView</Text>

        <FeedbackButton onPress={this.openChildView}>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>Open new child view</Text>
          </View>
        </FeedbackButton>

        <FeedbackButton onPress={this.closeChildView}>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>Close this child view</Text>
          </View>
        </FeedbackButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333ddd',
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonLabel: {
    color: '#333ddd'
  }
});

export default ChildView;
