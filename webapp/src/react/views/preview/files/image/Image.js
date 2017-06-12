import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadImage from 'blueimp-load-image';
import { bindAll } from 'swipes-core-js/classes/utils';
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
    loadImage(props.file.url, (img) => {
      if(img.type === "error") {
        this.props.onError("Error loading image " + imageUrl);
      } else {
        console.log(this.cont);
        console.log('loaded image', img, this.cont);
        this.cont.appendChild(img);
        this.props.onLoad();
        //document.body.appendChild(img);
      }
    }, {
      orientation: true,
      crossOrigin: true,
    });
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
      <div ref={(cont) => { this.cont = cont; }} className={className} onClick={this.toggleRawSize}>
        {/*<img
          onLoad={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          className="preview-image__image"
          role="presentation"
        />*/}
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
