import React, { Component } from 'react';
import { SwissProvider } from 'swiss-react';

import SW from './Image.swiss';

class Image extends Component {
  static supportContentType(contentType) {
    return ([
      'image/png',
      'image/gif',
    ].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
    this.state = {
      fullSize: false,
    };
  }
  onToggle = () => {
    const { fullSize } = this.state;
    this.setState({ fullSize: !fullSize });
  }
  render() {
    const { file } = this.props;
    const { fullSize } = this.state;

    return (
      <SwissProvider fullSize={fullSize}>
        <SW.Wrapper>
          <SW.Img
            onLoad={this.props.onLoad}
            onError={this.props.onError}
            onClick={this.onToggle}
            src={file.url}
            role="presentation"
          />
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}

export default Image;