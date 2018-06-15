import React, { Component } from 'react';
import { styleElement, addGlobalStyles } from 'swiss-react';

import styles from './Video.swiss';

addGlobalStyles(styles.GlobalStyles);
const Wrapper = styleElement('div', styles.Wrapper);
const Player = styleElement('video', styles.Player);

class Video extends Component {
  static supportContentType(contentType) {
    return ([
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/ogg',
    ].indexOf(contentType) !== -1);
  }
  render() {
    const { file } = this.props;
    const className = 'preview-video';

    return (
      <Wrapper>
        <Player
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

export default Video;