import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import './styles/svg';

class SVG extends Component {
  static supportContentType(contentType) {
    return ([
      'image/svg+xml',
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
    this.state = {};
    fetch(props.file.url, {
      method: 'GET',
      contentType: '',
    }).then((res) => {
      if (res && res.status === 200) {
        return res.text();
      } else {
        props.onError();
      }
    }).then((svg) => {
      props.onLoad();
      this.setState({ renderedSVG: svg });
    });
  }
  renderSVG() {
    const { renderedSVG } = this.state;
    return renderedSVG;
  }
  render() {
    const { file } = this.props;
    const { renderedSVG } = this.state;

    return (
      <div
        className="preview-svg"
        dangerouslySetInnerHTML={{ __html: renderedSVG }}
      />
    );
  }
}

export default SVG;

const { object, func } = PropTypes;

SVG.propTypes = {
  file: object,
  onError: func,
  onLoad: func,
};
