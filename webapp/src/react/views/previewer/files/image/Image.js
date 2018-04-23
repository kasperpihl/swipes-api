import React, { Component } from 'react';
import { styleElement, SwissProvider } from 'react-swiss';

import styles from './Image.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Img = styleElement('img', styles.Img);

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
        <Wrapper>
          <Img
            onLoad={this.props.onLoad}
            onError={this.props.onError}
            onClick={this.onToggle}
            src={file.url}
            role="presentation"
          />
        </Wrapper>
      </SwissProvider>
    );
  }
}

export default Image;