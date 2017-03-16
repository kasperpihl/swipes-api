import React, { PureComponent, PropTypes } from 'react';

class Webview extends PureComponent {

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
      <div
        ref="container"
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
