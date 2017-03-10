import React, { PureComponent, PropTypes } from 'react';
import PDF from 'react-pdf';

class PDFRender extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { file, scale, page, onDocumentComplete } = this.props;

    return (
      <PDF
        file={file}
        scale={scale}
        onDocumentLoad={onDocumentComplete}
        pageIndex={page}
        loading={(<span />)}
      />
    );
  }
}

export default PDFRender;

const { string, number, func } = PropTypes;

PDFRender.propTypes = {
  file: string,
  scale: number,
  page: number,
  onDocumentComplete: func,
};
