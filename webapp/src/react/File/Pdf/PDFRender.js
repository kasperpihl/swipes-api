import React, { PureComponent } from 'react';
// import { Document, Page } from 'react-pdf/dist/entry.webpack';

class PDFRender extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { file, scale, page, onDocumentComplete } = this.props;

    return (
      <Document
        file={file}
        onLoadSuccess={onDocumentComplete}
        loading={<span />}
      >
        <Page pageIndex={page} scale={scale} />
      </Document>
    );
  }
}

export default PDFRender;
