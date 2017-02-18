import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import './styles/image';

class Image extends Component {
  static supportContentType(contentType) {
    return ([
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
    this.state = {
      rawSize: false,
    };
    bindAll(this, ['toggleRawSize']);
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
