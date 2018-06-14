import React, { Component } from 'react';

import SW from './Audio.swiss';

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
      <SW.Wrapper>
        <audio
          autoPlay
          onLoadedData={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          controls
        />
      </SW.Wrapper>
    );
  }
}

export default Audio;