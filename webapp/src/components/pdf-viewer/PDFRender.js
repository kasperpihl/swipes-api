import React, { Component, PropTypes } from 'react';
import PDF from 'react-pdf';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class PDFRender extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { file, scale, page, onDocumentComplete } = this.props;

    return (
      <PDF
        file={file}
        scale={scale}
        onDocumentComplete={onDocumentComplete}
        page={page}
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
