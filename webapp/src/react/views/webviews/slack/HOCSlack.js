import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import Webview from 'components/webview/Webview';
import './styles/slack-view';

class HOCSlack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://swipes.slack.com/messages/',
      persistId: `browser${props.me.get('id')}`,
    };
    this.onLoad = this.onLoad.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps) {
    if (prevProps.hidden !== this.props.hidden && !this.props.hidden) {
      // Super hack haha. Don't change ref in SlackWebview
      this.refs.slack.refs.container.getElementsByClassName('webview')[0].focus();
    }
    if (this.props.openIn && prevProps.openIn !== this.props.openIn) {
      this._webview.send('message', {
        type: 'open',
        id: this.props.openIn,
      });
    }
  }
  onLoad(webview) {
    this._webview = webview;
    webview.addEventListener('dom-ready', () => {
      // webview.openDevTools();
    });
    webview.addEventListener('ipc-message', (event) => {
      const arg = event.args[0];
      // Pass the received message on to the communicator
      // console.log(arg);
      const { setCounter } = this.props;
      let counter = '';
      if (arg.counter) {
        counter = arg.counter;
      }
      if (!counter && arg.unread) {
        counter = '\u2022';
      }
      setCounter('slack', counter);
      window.ipcListener.setBadgeCount(counter);
    });
    webview.addEventListener('new-window', (e) => {
      const { browser } = this.props;
      browser(e.url);
    });
  }


  render() {
    const { hidden } = this.props;
    const { url, persistId } = this.state;

    let className = 'slack-view';
    if (hidden) {
      className += ' hide';
    }
    const preloadUrl = window.ipcListener.preloadUrl('slack-preload');
    return (
      <div className={className}>
        <Webview ref="slack" preloadUrl={preloadUrl} url={url} persistId={persistId} onLoad={this.onLoad} />
      </div>
    );
  }
}

const { func, bool, string } = PropTypes;
HOCSlack.propTypes = {
  setCounter: func,
  browser: func,
  openIn: string,
  hidden: bool,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  browser: actions.main.browser,
  setCounter: actions.navigation.setCounter,
})(HOCSlack);
