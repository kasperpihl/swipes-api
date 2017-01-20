import React, { Component, PropTypes } from 'react';
import PDFViewer from './PDFViewer';

class PDF extends Component {
  static supportContentType(contentType) {
    return (['application/pdf'].indexOf(contentType) !== -1);
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  fileLoaded(e) {
    console.log('loaded file', e);
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
};
