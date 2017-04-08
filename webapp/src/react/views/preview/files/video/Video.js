import React, { Component, PropTypes } from 'react';
import { bindAll } from 'swipes-core-js/classes/utils';
import './styles/video';

class Video extends Component {
  static supportContentType(contentType) {
    return ([
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
  }
  render() {
    const { file } = this.props;
    const { rawSize } = this.state;
    let className = 'preview-video';

    if (rawSize) {
      className += ' preview-video--full-size';
    }

    return (
      <div className={className}>
        <video
          onLoad={this.props.onLoad}
          onError={this.props.onError}
          src={file.url}
          controls
        />
      </div>
    );
  }
}

export default Video;

const { object, func } = PropTypes;

Video.propTypes = {
  file: object,
  onError: func,
  onLoad: func,
};
