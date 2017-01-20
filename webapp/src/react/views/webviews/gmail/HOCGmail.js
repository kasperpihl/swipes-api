import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import Webview from 'components/webview/Webview';
import './styles/gmail-view';

class HOCGmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://mail.google.com',
      persistId: `browser${props.me.get('id')}`,
    };
    this.onLoad = this.onLoad.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.hidden !== this.props.hidden && !this.props.hidden) {
      // Super hack haha. Don't change ref in SlackWebview
      this.refs.gmail.refs.container.getElementsByClassName('webview')[0].focus();
    }
  }
  onLoad(webview) {
    webview.addEventListener('dom-ready', () => {
      // webview.openDevTools();
    });
    webview.addEventListener('new-window', (e) => {
      const { browser } = this.props;
      browser(e.url);
    });
  }
  render() {
    const { hidden } = this.props;
    const { url, persistId } = this.state;

    let className = 'gmail-view';
    if (hidden) {
      className += ' hide';
    }

    return (
      <div className={className}>
        <Webview ref="gmail" url={url} persistId={persistId} onLoad={this.onLoad} />
      </div>
    );
  }
}

const { func, bool } = PropTypes;
HOCGmail.propTypes = {
  me: map,
  browser: func,
  hidden: bool,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  browser: actions.main.browser,
})(HOCGmail);
