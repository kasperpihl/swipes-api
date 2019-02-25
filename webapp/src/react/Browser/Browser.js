import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SWView from 'src/react/_Layout/view-controller/SWView';
import Loader from 'src/react/_components/loaders/Loader';
import withNav from 'src/react/_hocs/Nav/withNav';
import BrowserNavBar from './BrowserNavBar';
import BrowserWebview from './BrowserWebview';
import SW from './Browser.swiss';

@withNav
@connect(state => ({
  me: state.me
}))
export default class Browser extends PureComponent {
  static minWidth() {
    return 800;
  }
  static maxWidth() {
    return 1600;
  }
  constructor(props) {
    super(props);
    this.state = {
      backEnabled: false,
      forwardEnabled: false,
      title: '',
      currentUrl: props.url,
      isLoading: true
    };
    this.onLoad = this.onLoad.bind(this);
  }

  componentWillUnmount() {
    this._unmounted = true;
  }
  onLoad(webview) {
    webview.focus();
    this.webview = webview;
    const { onLoad } = this.props;
    if (onLoad) {
      onLoad(webview);
    }
    webview.addEventListener('dom-ready', () => {
      const { isLoading } = this.state;
      if (isLoading && !this._unmounted) {
        this.setState({ isLoading: false });
      }
      // webview.openDevTools();
    });
    webview.addEventListener('did-navigate', e => {
      if (!this._unmounted) {
        this.updateUrl(e.url);
      }
    });
    webview.addEventListener('did-navigate-in-page', e => {
      if (!this._unmounted && e.isMainFrame) {
        this.updateUrl(e.url);
      }
    });
    webview.addEventListener('page-title-updated', e => {
      if (!this._unmounted) {
        this.setState({ title: e.title });
      }
    });
  }

  updateUrl(url) {
    const updateObj = {
      currentUrl: url
    };

    updateObj.backEnabled = this.webview.canGoBack();
    updateObj.forwardEnabled = this.webview.canGoForward();
    this.setState(updateObj);
  }
  handleAction(action) {
    switch (action) {
      case 'browser':
        window.open(this.state.currentUrl);
        this.props.nav.pop();
        return null;
      case 'back':
        return this.webview.goBack();
      case 'forward':
        return this.webview.goForward();
      case 'reload':
        return this.webview.reload();
      default:
        return null;
    }
  }
  renderLoader() {
    const { isLoading } = this.state;
    if (!isLoading) {
      return undefined;
    }
    return (
      <SW.BrowserLoader>
        <Loader
          center
          text="Loading"
          textStyle={{ color: '#333D59', marginTop: '9px' }}
        />
      </SW.BrowserLoader>
    );
  }
  render() {
    const { url, me } = this.props;
    const { forwardEnabled, backEnabled, title, currentUrl } = this.state;
    return (
      <SWView noframe>
        <BrowserWebview
          url={url}
          persistId={`browser${me.get('user_id')}`}
          onLoad={this.onLoad}
        />
        <BrowserNavBar
          backEnabled={backEnabled}
          forwardEnabled={forwardEnabled}
          onAction={this.handleAction}
          title={title}
          url={currentUrl}
        />
        {this.renderLoader()}
      </SWView>
    );
  }
}
