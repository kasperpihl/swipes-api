import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class SlackWebview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    const { onLoad } = this.props;
    const webview = this.getWebview();
    if (onLoad) {
      onLoad(webview);
    }
  }
  getWebview() {
    return this.refs.container.childNodes[0];
  }
  getWebviewHtml() {
    const preloadUrl = window.ipcListener.preloadUrl('slack-preload');
    console.log(preloadUrl);
    const { persistId, url } = this.props;
    let html = `<webview src="${url}" class="webview" `;
    html += `preload="${preloadUrl}" `;
    html += `partition="persist:${persistId}"`;
    html += '></webview>';

    return html;
  }
  render() {
    const wHtml = this.getWebviewHtml();
    return (
      <div
        ref="container"
        style={{ height: '100%' }}
        dangerouslySetInnerHTML={{ __html: wHtml }}
      />
    );
  }
}

export default SlackWebview;

const { string, func } = PropTypes;

SlackWebview.propTypes = {
  url: string.isRequired,
  persistId: string,
  onLoad: func,
};
