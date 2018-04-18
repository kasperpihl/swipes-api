import React, { Component } from 'react';
import './styles/video';

class Video extends Component {
  static supportContentType(contentType) {
    return ([
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/ogg',
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
  }
  render() {
    const { file } = this.props;
    const className = 'preview-video';

    return (
      <div className={className}>
        <video
          autoPlay
          onLoadedData={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          className="preview-video__player"
          controls
        />
      </div>
    );
  }
}

export default Video;