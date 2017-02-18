import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
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
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate);
  }
  fileLoaded() {
    this.callDelegate('onLoaded');
  }
  render() {
    const { file } = this.props;
    return (
      <PDFViewer file={file.url} fileLoaded={this.fileLoaded} />
    );
  }
}

export default PDF;

const { object } = PropTypes;

PDF.propTypes = {
  file: object,
  delegate: object,
};
