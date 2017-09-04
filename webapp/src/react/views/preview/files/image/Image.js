import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/image';

class Image extends Component {
  static supportContentType(contentType) {
    return ([
      'image/png',
      'image/gif',
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
    this.state = {
      rawSize: false,
    };

  }
  render() {
    const { file } = this.props;
    const { rawSize } = this.state;

    return (
      <div className="preview-image" >
        <img
          onLoad={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          className="preview-image__image"
          role="presentation"
        />
      </div>
    );
  }
}

export default Image;

const { object, func } = PropTypes;

Image.propTypes = {
  file: object,
  onError: func,
  onLoad: func,
};
