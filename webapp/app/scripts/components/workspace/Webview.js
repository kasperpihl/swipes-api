import React, { Component, PropTypes } from 'react'

class Webview extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const webview = this.refs.webview
    // Provide the sendFunction that the communicator will use to send the commands
    const sendFunction = (data) => { webview.send('message', data) }
    webview.addEventListener('dom-ready', () => {
      this.props.onLoad(sendFunction);
      webview.openDevTools();
    })
    webview.addEventListener('ipc-message', (event) => {
      var arg = event.args[0];
      // Pass the received message on to the communicator
      this.props.receivedCommand(arg);
    });
  }
  render() {
    return <webview
          preload={this.props.preloadUrl}
          src={this.props.url}
          ref='webview'
          className="workflow-frame-class"></webview>;
  }
}
export default Webview

Webview.propTypes = {
  preloadUrl: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  receivedCommand: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired
}
