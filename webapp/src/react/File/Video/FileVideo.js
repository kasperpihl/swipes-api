import React, { Component } from 'react';

import SW from './FileVideo.swiss';

export default class FileVideo extends Component {
  static supportContentType(contentType) {
    return (
      ['video/mp4', 'video/quicktime', 'video/webm', 'video/ogg'].indexOf(
        contentType
      ) !== -1
    );
  }
  render() {
    const { file } = this.props;
    const className = 'preview-video';

    return (
      <SW.Wrapper>
        <SW.Player
          autoPlay
          onLoadedData={this.props.onLoad}
          onError={this.props.onError}
          src={file.s3_url}
          controls
        />
      </SW.Wrapper>
    );
  }
}
