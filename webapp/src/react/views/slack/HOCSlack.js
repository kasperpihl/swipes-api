import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import SlackWebview from './SlackWebview';
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
  }
  onLoad(webview) {
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
  }


  render() {
    const { hidden } = this.props;
    const { url, persistId } = this.state;

    let className = 'slack-view';
    if (hidden) {
      className += ' hide';
    }

    return (
      <div className={className}>
        <SlackWebview ref="slack" url={url} persistId={persistId} onLoad={this.onLoad} />
      </div>
    );
  }
}

const { func, bool } = PropTypes;
HOCSlack.propTypes = {
  setCounter: func,
  hidden: bool,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  setCounter: actions.navigation.setCounter,
})(HOCSlack);
