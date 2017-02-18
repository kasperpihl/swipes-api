import React, { Component, PropTypes } from 'react';
import PDFViewer from './PDFViewer';

class PDF extends Component {
  static supportContentType(contentType) {
    return ([
      'application/pdf',
      'application/vnd.google-apps.document',
      'application/vnd.google-apps.drawing',
      'application/vnd.google-apps.presentation',
      'application/vnd.google-apps.spreadsheet',
    ].indexOf(contentType) !== -1);
  }
  render() {
    const { file } = this.props;
    return (
      <PDFViewer file={file.url} fileLoaded={this.props.onLoad} />
    );
  }
}

export default PDF;

const { object, func } = PropTypes;

PDF.propTypes = {
  file: object,
  onLoad: func,
  onError: func,
};
