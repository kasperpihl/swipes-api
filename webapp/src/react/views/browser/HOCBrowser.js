import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import SWView from 'SWView';
import Webview from 'components/webview/Webview';
import Loader from 'components/loaders/Loader';
import BrowserNavBar from './BrowserNavBar';

import './styles/browser';

class HOCBrowser extends PureComponent {
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
      isLoading: true,
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
    webview.addEventListener('did-navigate', (e) => {
      if (!this._unmounted) {
        this.updateUrl(e.url);
      }
    });
    webview.addEventListener('did-navigate-in-page', (e) => {
      if (!this._unmounted && e.isMainFrame) {
        this.updateUrl(e.url);
      }
    });
    webview.addEventListener('page-title-updated', (e) => {
      if (!this._unmounted) {
        this.setState({ title: e.title });
      }
    });
  }

  updateUrl(url) {
    const updateObj = {
      currentUrl: url,
    };

    updateObj.backEnabled = this.webview.canGoBack();
    updateObj.forwardEnabled = this.webview.canGoForward();
    this.setState(updateObj);
  }
  navbarAction(action) {
    switch (action) {
      case 'browser':
        return window.open(this.state.currentUrl);
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
      <div className="browser-loader">
        <Loader center text="Loading" textStyle={{ color: '#333D59', marginTop: '9px' }} />
      </div>
    );
  }
  render() {
    const { url, me } = this.props;
    const {
      forwardEnabled,
      backEnabled,
      title,
      currentUrl,
    } = this.state;
    return (
      <SWView noframe>

        <Webview
          className="browser-overlay__webview-container"
          url={url}
          persistId={`browser${me.get('id')}`}
          onLoad={this.onLoad}
        />
        <BrowserNavBar
          backEnabled={backEnabled}
          forwardEnabled={forwardEnabled}
          delegate={this}
          title={title}
          url={currentUrl}
        />
        {this.renderLoader()}
      </SWView>
    );
  }
}

const { string, func } = PropTypes;
HOCBrowser.propTypes = {
  url: string,
  onLoad: func,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCBrowser);
