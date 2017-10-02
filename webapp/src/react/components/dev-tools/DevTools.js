import React, { PureComponent } from 'react';
/* global Perf*/

window.Perf = require('react-addons-perf');
// Exported from redux-devtools

class DevTools extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { recording: false };
    this.toggleRecording = this.toggleRecording.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 83 && (e.metaKey || e.ctrlKey)) {
        this.toggleRecording();
      }
    });
  }
  toggleRecording() {
    if (this.state.recording) {
      Perf.stop();
      Perf.printWasted();
      this.setState({ recording: false });
    } else {
      Perf.start();
      this.setState({ recording: true });
    }
  }
  render() {
    const styles = {
      position: 'fixed',
      background: 'red',
      display: 'none',
      top: '3px',
      borderRadius: '50%',
      right: '3px',
      width: '12px',
      height: '12px',
      zIndex: '10000',
    };
    if (this.state.recording) {
      styles.display = 'block';
    }
    return (
      <div style={styles} onClick={this.toggleRecording} />
    );
  }
}

export default DevTools;
