import React, { PureComponent, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { cache } from 'swipes-core-js';
import { bindAll } from 'classes/utils';
import Webview from 'components/webview/Webview';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Button from 'Button';
import './styles/slack-view';

class HOCSlack extends PureComponent {
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
    const { saveCache } = this.props;
    const { teamDomain } = this.state;
    saveCache('slackDomain', teamDomain);
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
      setCounter('Slack', counter);
    });
    webview.addEventListener('new-window', (e) => {
      const { browser } = this.props;
      browser('primary', e.url);
    });
  }
  renderSetup() {
    const { slackDomain } = this.props;
    if (slackDomain) {
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
    const { slackDomain } = this.props;
    const { persistId } = this.state;
    if (!slackDomain) {
      return undefined;
    }
    const preloadUrl = window.ipcListener.preloadUrl('slack-preload');
    const url = `https://${slackDomain}.slack.com/messages`;
    return (
      <Webview
        ref="slack"
        preloadUrl={preloadUrl}
        url={url}
        persistId={persistId}
        onLoad={this.onLoad}
        style={{ height: '100%' }}
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
  saveCache: func,
  openIn: string,
  hidden: bool,
  slackDomain: string,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    openIn: state.getIn(['main', 'slackOpenIn']),
    slackDomain: state.getIn(['cache', 'slackDomain']),
  };
}

export default connect(mapStateToProps, {
  browser: actions.main.browser,
  openSlackIn: actions.main.openSlackIn,
  saveCache: cache.save,
  setCounter: actions.navigation.setCounter,
})(HOCSlack);
