import React, { Component } from 'react';
import { styleElement } from 'react-swiss';

import styles from './Audio.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class Audio extends Component {
  static supportContentType(contentType) {
    return ([
      'audio/webm',
      'audio/ogg',
      'audio/wave',
      'audio/wav',
      'audio/mpeg',

    ].indexOf(contentType) !== -1);
  }
  render() {
    const { file } = this.props;

    return (
      <Wrapper>
        <audio
          autoPlay
          onLoadedData={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          controls
        />
      </Wrapper>
    );
  }
}

export default Audio;