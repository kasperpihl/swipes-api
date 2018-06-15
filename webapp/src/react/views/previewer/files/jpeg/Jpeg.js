import React, { Component } from 'react';
import loadImage from 'blueimp-load-image';
import { styleElement } from 'swiss-react';

import styles from './Jpeg.swiss';

const Image = styleElement('div', styles.Image);

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
      fullSize: false,
    };
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
  onToggle = () => {
    const { fullSize } = this.state;
    this.setState({ fullSize: !fullSize });
  }
  render() {
    const { file } = this.props;
    const { fullSize } = this.state;

    return (
      <Image
        innerRef={(c) => { this.cont = c; }}
        onClick={this.onToggle}
        fullSize={fullSize}
      />
    );
  }
}

export default Jpeg;