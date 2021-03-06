import React, { Component } from 'react';

import SW from './FileImage.swiss';

export default class FileImage extends Component {
  static supportContentType(contentType) {
    return ['image/png', 'image/gif'].indexOf(contentType) !== -1;
  }
  constructor(props) {
    super(props);
    this.state = {
      fullSize: false
    };
  }
  onToggle = () => {
    const { fullSize } = this.state;
    this.setState({ fullSize: !fullSize });
  };
  render() {
    const { file } = this.props;
    const { fullSize } = this.state;

    return (
      <SW.ProvideContext fullSize={fullSize}>
        <SW.Wrapper>
          <SW.Img
            onLoad={this.props.onLoad}
            onError={this.props.onError}
            onClick={this.onToggle}
            src={file.s3_url}
            role="presentation"
          />
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
