import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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
    webview.addEventListener('dom-ready', (e) => {
      console.log('dom-ready', e);
    });
  }
  render() {
    const { url } = this.props;
    const wHtml = `<webview src="${url}" style="height: 100%;" partition="persist:browser"></webview>`;
    return (
      <div
        ref="container"
        style={{ height: '100%' }}
        dangerouslySetInnerHTML={{ __html: wHtml }}
      />

    );
  }
}

const { string } = PropTypes;
HOCBrowser.propTypes = {
  url: string,
};

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {

})(HOCBrowser);
