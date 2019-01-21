import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SW from './Browser.swiss';

class Webview extends PureComponent {

  componentDidMount() {
    const { onLoad } = this.props;
    const webview = this.getWebview();
    if (onLoad) {
      onLoad(webview);
    }
  }
  getWebview() {
    return this.container.childNodes[0];
  }
  getWebviewHtml(url, persistId, preloadUrl) {
    let html = `<webview src="${url}" class="webview" `;
    if (preloadUrl) {
      html += `preload="${preloadUrl}" `;
    }
    html += 'style="height: 100%;" ';
    html += `partition="persist:${persistId}"`;
    html += '></webview>';

    return html;
  }
  render() {
    const {
      persistId,
      url,
      preloadUrl,
      onLoad, // eslint-disable-line
      ...rest
    } = this.props;
    const wHtml = this.getWebviewHtml(url, persistId, preloadUrl);
    return (
      <SW.BrowserWebView
        innerRef={(c) => this.container = c}
        dangerouslySetInnerHTML={{ __html: wHtml }}
        {...rest}
      />
    );
  }
}

export default Webview;

const { string, func } = PropTypes;

Webview.propTypes = {
  url: string.isRequired,
  persistId: string,
  preloadUrl: string,
  onLoad: func,
};
