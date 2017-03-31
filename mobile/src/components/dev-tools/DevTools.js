import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import FeedbackButton from '../feedback-button/FeedbackButton';
/* global Perf*/
import PrefMonitor from 'react-native/Libraries/Performance/RCTRenderingPerf';
// Exported from redux-devtools

class DevTools extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { recording: false };
    this.toggleRecording = this.toggleRecording.bind(this);
  }
  toggleRecording() {
    if (this.state.recording) {
      PrefMonitor.stop();
      this.setState({ recording: false });
    } else {
      PrefMonitor.toggle();
      PrefMonitor.start();
      this.setState({ recording: true });
    }
  }
  render() {
    const { recording } = this.state;
    const buttonStateStyles = recording ? styles.buttonActive : styles.buttonIdle;

    return (
      <FeedbackButton onPress={this.toggleRecording}>
        <View style={[styles.button, buttonStateStyles]} />
      </FeedbackButton>
    );
  }
}

export default DevTools;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    right: 15,
    top: 30,
  },
  buttonIdle: {
    backgroundColor: 'green',
  },
  buttonActive: {
    backgroundColor: 'red',
  },
});