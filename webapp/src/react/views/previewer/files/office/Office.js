import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';

import styles from './Office.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class Office extends PureComponent {
  static supportContentType(contentType) {
    return ([
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].indexOf(contentType) !== -1);
  }
  render() {
    const { file } = this.props;
    return (
      <Wrapper>
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
          frameBorder="0"
          onLoad={this.props.onLoad}
          onError={this.props.onError}
        />
      </Wrapper>
    );
  }
}

export default Office;