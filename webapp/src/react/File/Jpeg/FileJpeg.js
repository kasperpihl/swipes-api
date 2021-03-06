import React, { Component } from 'react';
import loadImage from 'blueimp-load-image';

import SW from './FileJpeg.swiss';

export default class FileJpeg extends Component {
  static supportContentType(contentType) {
    return ['image/jpg', 'image/jpeg'].indexOf(contentType) !== -1;
  }
  constructor(props) {
    super(props);
    this.state = {
      fullSize: false
    };
    loadImage(
      props.file.s3_url,
      img => {
        if (img.type === 'error') {
          this.props.onError('Error loading image ');
        } else {
          this.cont.appendChild(img);
          this.props.onLoad();
        }
      },
      {
        orientation: true
        // crossOrigin: 'anonymous',
      }
    );
  }
  onToggle = () => {
    const { fullSize } = this.state;
    this.setState({ fullSize: !fullSize });
  };
  render() {
    const { file } = this.props;
    const { fullSize } = this.state;

    return (
      <SW.Image
        innerRef={c => {
          this.cont = c;
        }}
        onClick={this.onToggle}
        fullSize={fullSize}
      />
    );
  }
}
