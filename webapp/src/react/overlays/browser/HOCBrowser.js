import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';

class HOCBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    const webview = this.refs.container.childNodes[0];
    const { onLoad } = this.props;
    if (onLoad) {
      onLoad(webview, this.close);
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
    return (
      <div
        ref="container"
        style={{ height: '100%' }}
        dangerouslySetInnerHTML={{ __html: wHtml }}
      />

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
