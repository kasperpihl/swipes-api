import React, { Component } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import './styles/audio';

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
  constructor(props) {
    super(props);
  }
  render() {
    const { file } = this.props;
    let className = 'preview-audio';

    return (
      <div className={className}>
        <audio
          autoPlay
          onLoadedData={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          controls
        />
      </div>
    );
  }
}

export default Audio;