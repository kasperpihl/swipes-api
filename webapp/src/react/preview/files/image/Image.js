import React, { Component, PropTypes } from 'react';

import './styles/image';

class Image extends Component {
  static supportContentType(contentType) {
    return ([
      'image/jpg',
      'image/jpeg',
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
    this.state = {
      rawSize: false,
    };
    this.toggleRawSize = this.toggleRawSize.bind(this);
  }
  toggleRawSize() {
    const { rawSize } = this.state;
    this.setState({ rawSize: !rawSize });
  }
  render() {
    const { file } = this.props;
    const { rawSize } = this.state;
    let className = 'preview-image';

    if (rawSize) {
      className += ' preview-image--full-size';
    }

    return (
      <div className={className} onClick={this.toggleRawSize}>
        <img src={file.url} className="preview-image__image" role="presentation" />
      </div>
    );
  }
}

export default Image;

const { object } = PropTypes;

Image.propTypes = {
  file: object,
};
