import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';
import Webview from 'components/webview/Webview';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Button from 'Button';
import './styles/slack-view';

class HOCSlack extends Component {
  static minWidth() {
    return 800;
  }
  static maxWidth() {
    return 1200;
  }
  constructor(props) {
    super(props);
    this.state = {
      persistId: `browser${props.me.get('id')}`,
      teamDomain: '',
    };
    bindAll(this, ['onKeyDown', 'onClick', 'onChange', 'onLoad']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps) {
    if (this._webview && prevProps.hidden !== this.props.hidden && !this.props.hidden) {
      // Super hack haha. Don't change ref in SlackWebview
      this.refs.slack.refs.container.getElementsByClassName('webview')[0].focus();
    }
    if (this._webview && this.props.openIn && prevProps.openIn !== this.props.openIn) {
      const { openSlackIn } = this.props;
      this._webview.send('message', {
        type: 'open',
        id: this.props.openIn,
      });
      openSlackIn(null);
    }
  }
  onChange(title) {
    this.setState({ teamDomain: title });
  }
  onKeyDown(e) {
    if (e.keyCode === 13) this.onClick();
  }
  onClick() {
    const { setSlackUrl } = this.props;
    const { teamDomain } = this.state;
    setSlackUrl(`https://${teamDomain}.slack.com/messages`);
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
  renderSetup() {
    const { slackUrl } = this.props;
    if (slackUrl) {
      return undefined;
    }
    const { teamDomain } = this.state;
    return (
      <div className="slack-view__setup">
        <h1>Run Slack inside Swipes</h1>
        <h2>Stay with your team on the same page, without having to switch between windows.</h2>

        <div className="slack-view__form">
          <FloatingInput
            label="teamdomain"
            type="text"
            id="teamdomain"
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            value={teamDomain}
          />
          <div className="slack-view__url">.slack.com</div>
          <Button
            text="Continue"
            primary
            onClick={this.onClick}
          />
        </div>
      </div>
    );
  }
  renderWebview() {
    const { slackUrl } = this.props;
    const { persistId } = this.state;
    if (!slackUrl) {
      return undefined;
    }
    const preloadUrl = window.ipcListener.preloadUrl('slack-preload');

    return (
      <Webview
        ref="slack"
        preloadUrl={preloadUrl}
        url={slackUrl}
        persistId={persistId}
        onLoad={this.onLoad}
      />
    );
  }
  render() {
    const { hidden } = this.props;

    let className = 'slack-view';
    if (hidden) {
      className += ' hide';
    }
    return (
      <div className={className}>
        {this.renderSetup()}
        {this.renderWebview()}
      </div>
    );
  }
}

const { func, bool, string } = PropTypes;
HOCSlack.propTypes = {
  setCounter: func,
  browser: func,
  openSlackIn: func,
  setSlackUrl: func,
  openIn: string,
  hidden: bool,
  slackUrl: string,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    slackUrl: state.getIn(['main', 'slackUrl']),
  };
}

export default connect(mapStateToProps, {
  browser: actions.main.browser,
  openSlackIn: actions.main.openSlackIn,
  setSlackUrl: actions.main.setSlackUrl,
  setCounter: actions.navigation.setCounter,
})(HOCSlack);
