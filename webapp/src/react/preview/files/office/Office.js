import React, { PureComponent, PropTypes } from 'react';

import './styles/office.scss';

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
      <div className="preview-office" onClick={this.toggleRawSize}>
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${file.url}`}
          frameBorder="0"
        />
      </div>
    );
  }
}

export default Office;

const { object } = PropTypes;

Office.propTypes = {
  file: object,
};
