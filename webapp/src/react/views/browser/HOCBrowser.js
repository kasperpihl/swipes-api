import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import BrowserNavBar from './BrowserNavBar';
import SWView from 'SWView';
import './styles/browser';

class HOCBrowser extends Component {
  static minWidth() {
    return 800;
  }
  static maxWidth() {
    return 1600;
  }
  static fullscreen() {
    return true;
  }
  constructor(props) {
    super(props);
    this.state = {
      backEnabled: false,
      forwardEnabled: false,
      title: '',
      currentUrl: props.url,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    const webview = this.getWebview();
    webview.focus();
    const { onLoad } = this.props;
    if (onLoad) {
      onLoad(webview, this.close.bind(this));
    }
    webview.addEventListener('dom-ready', () => {
      // webview.openDevTools();
    });
    webview.addEventListener('did-navigate', (e) => {
      this.updateUrl(e.url);
    });
    webview.addEventListener('did-navigate-in-page', (e) => {
      if (e.isMainFrame) {
        this.updateUrl(e.url);
      }
    });
    webview.addEventListener('page-title-updated', (e) => {
      this.setState({ title: e.title });
    });
  }
  updateUrl(url) {
    const updateObj = {
      currentUrl: url,
    };
    const webview = this.getWebview();
    updateObj.backEnabled = webview.canGoBack();
    updateObj.forwardEnabled = webview.canGoForward();
    this.setState(updateObj);
  }
  getWebview() {
    return this.refs.container.childNodes[0];
  }
  navbarAction(action) {
    const webview = this.getWebview();
    switch (action) {
      case 'close':
        return this.close();
      case 'browser':
        return window.open(this.state.currentUrl);
      case 'back':
        return webview.goBack();
      case 'forward':
        return webview.goForward();
      case 'reload':
        return webview.reload();
      default:
        return null;
    }
  }
  close() {
    const { overlay } = this.props;
    overlay(null);
  }
  getWebviewHtml() {
    const { url, me } = this.props;
    let html = `<webview src="${url}" `;
    html += 'style="height: 100%;" ';
    html += `partition="persist:browser${me.get('id')}"`;
    html += '></webview>';

    return html;
  }
  render() {
    const wHtml = this.getWebviewHtml();
    const {
      forwardEnabled,
      backEnabled,
      title,
      currentUrl,
    } = this.state;
    return (
      <SWView noframe>
        <div
          ref="container"
          className="browser-overlay__webview-container"
          dangerouslySetInnerHTML={{ __html: wHtml }}
        />
        <BrowserNavBar
          backEnabled={backEnabled}
          forwardEnabled={forwardEnabled}
          delegate={this}
          title={title}
          url={currentUrl}
        />
      </SWView>
    );
  }
}

const { string, func } = PropTypes;
HOCBrowser.propTypes = {
  url: string,
  onLoad: func,
  overlay: func,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  overlay: actions.main.overlay,
})(HOCBrowser);
