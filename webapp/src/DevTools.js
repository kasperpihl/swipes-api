import React, { Component, PropTypes } from 'react';
window.Perf = require('react-addons-perf');
// Exported from redux-devtools

class DevTools extends Component {
  constructor(props) {
    super(props)
    this.state = { recording: false };
    this.toggleRecording = this.toggleRecording.bind(this);
  }
  toggleRecording(){
    if(this.state.recording){
      Perf.stop();
      Perf.printWasted();
      this.setState({ recording: false });
    }
    else{
      Perf.start();
      this.setState({ recording: true });
    }
  }
  componentDidMount() {
    window.addEventListener('keydown', (e) => {
      if(e.keyCode === 83 && (e.metaKey || e.ctrlKey)){
        this.toggleRecording();
      }
    });
  }
  render() {
    const styles = {
      position: 'fixed',
      background: 'red',
      top: 0,

      right: 0,
      width: '9px',
      height: '9px',
      zIndex: '99999'
    }
    if(this.state.recording){
      styles.background = 'green'
    }
    return (
      <div style={styles} onClick={this.toggleRecording}>
      </div>
    )
  }
}
export default DevTools
module.exports = DevTools

/*
import { createDevTools } from 'redux-devtools';
// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

// createDevTools takes a monitor and produces a DevTools component
const DevTools = createDevTools(
  // Monitors are individually adjustable with props.
  // Consult their repositories to learn about those props.
  // Here, we put LogMonitor inside a DockMonitor.
  // Note: DockMonitor is visible by default.
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'
               defaultIsVisible={false}>
    <LogMonitor theme='tomorrow' />
  </DockMonitor>
);

export default DevTools;
module.exports = DevTools;
*/