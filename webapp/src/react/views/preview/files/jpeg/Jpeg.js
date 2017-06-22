import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadImage from 'blueimp-load-image';
import { bindAll } from 'swipes-core-js/classes/utils';
import './styles/jpeg';

class Jpeg extends Component {
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
    bindAll(this, ['toggleRawSize']);
    loadImage(props.file.url, (img) => {
      if(img.type === "error") {
        this.props.onError("Error loading image ");
      } else {
        this.cont.appendChild(img);
        this.props.onLoad();
      }
    }, {
      orientation: true,
      // crossOrigin: 'anonymous',
    });
  }
  toggleRawSize() {
    const { rawSize } = this.state;
    this.setState({ rawSize: !rawSize });
  }
  render() {
    const { file } = this.props;
    const { rawSize } = this.state;
    let className = 'preview-jpeg';

    if (rawSize) {
      className += ' preview-jpeg--full-size';
    }

    return (
      <div ref={(cont) => { this.cont = cont; }} className={className} onClick={this.toggleRawSize}>
        {/*<img
          onLoad={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          className="preview-jpeg__image"
          role="presentation"
        />*/}
      </div>
    );
  }
}

export default Jpeg;

const { object, func } = PropTypes;

Jpeg.propTypes = {
  file: object,
  onError: func,
  onLoad: func,
};
