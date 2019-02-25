import React, { Component } from 'react';
import PDFViewer from './PDFViewer';

export default class FilePdf extends Component {
  static supportContentType(contentType) {
    return (
      [
        'application/pdf',
        'application/vnd.google-apps.document',
        'application/vnd.google-apps.drawing',
        'application/vnd.google-apps.presentation',
        'application/vnd.google-apps.spreadsheet'
      ].indexOf(contentType) !== -1
    );
  }
  render() {
    const { file } = this.props;
    return <PDFViewer file={file.s3_url} fileLoaded={this.props.onLoad} />;
  }
}
