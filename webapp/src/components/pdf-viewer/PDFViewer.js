import React, { Component, PropTypes } from 'react'
import PDF from 'react-pdf'
import { bindAll } from '../../classes/utils'
import Loader from '../swipes-ui/Loader'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class PDFViewer extends Component {
  constructor(props) {
    super(props)
    this.state = { page: 1, pages: 0 }
    bindAll(this, ['nextPage', 'prevPage', '_onDocumentComplete']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  prevPage(){
    const { page } = this.state;
    const newPage = page > 1 ? page - 1 : 1
    if(page !== newPage) {
      this.setState({ page: newPage });
    }
  }
  nextPage(){
    const { page, pages } = this.state;
    const newPage = page < pages ? page + 1 : pages;
    if(page !== newPage) {
      this.setState({ page: newPage });
    }
  }
  render() {
    const { file } = this.props;
    const { page } = this.state;
    return (
      <div onClick={this.nextPage} className="sw-pdf-viewer">
        <PDF ref="pdf" file={file} loading={<Loader center={true} text="Loading" />}
            onDocumentComplete={this._onDocumentComplete} page={page} />
      </div>
    )
  }
  _onDocumentComplete(pages){
    console.log('pages', pages);
    this.setState({ pages });
  }
}
export default PDFViewer

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
PDFViewer.propTypes = {
}