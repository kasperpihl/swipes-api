import React, { Component, PropTypes } from 'react'
import PDF from 'react-pdf'
import { bindAll } from '../../classes/utils'
import Loader from '../swipes-ui/Loader'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './styles/pdf-viewer.scss'

class PDFViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      pages: 0,
      scale: 1.8,
      loaded: false
    }

    bindAll(this, ['nextPage', 'prevPage', '_onDocumentComplete', 'scaleUp']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {}
  prevPage() {
    const { page } = this.state;
    const newPage = page > 1 ? page - 1 : 1

    if (page !== newPage) {
      this.setState({ page: newPage });
    }
  }
  nextPage() {
    const { page, pages } = this.state;
    const newPage = page < pages ? page + 1 : pages;

    // if (page !== newPage) {
    //   this.setState({ page: newPage });
    // }
  }
  hasNextPage() {
    const { page, pages } = this.state;

    return (page < pages);
  }
  hasPrevPage() {
    const { page } = this.state;

    return (page > 1);
  }
  scaleUp() {
    const biggerScale = this.state.scale + .1;

    this.setState({scale: biggerScale})
  }
  renderActions() {
    const { loaded } = this.state;

    if (!loaded) return;

    return (
      <div className="sw-pdf-viewer__actions">

      </div>
    )
  }
  render() {
    const { file } = this.props;
    const { page } = this.state;

    return (
      <div className="sw-pdf-viewer">
        <PDF ref="pdf" file={file} scale={this.state.scale} onDocumentComplete={this._onDocumentComplete}
        page={page} loading={(<span></span>)} />
        {this.renderActions()}
      </div>
    )
  }

  _onDocumentComplete(pages) {
    const { fileLoaded } = this.props;
    const { loaded } = this.state;

    this.setState({ pages });
    this.setState({loaded: true})

    if (fileLoaded) {
      fileLoaded(loaded)
    }
  }
}
export default PDFViewer

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

PDFViewer.propTypes = {

}
