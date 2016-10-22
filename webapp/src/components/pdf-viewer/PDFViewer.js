import React, { Component, PropTypes } from 'react'
import PDF from 'react-pdf'
import { ArrowIcon } from '../icons'
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
      scale: 1,
      loaded: false,
      inputValue: 0,
      error: false
    }

    bindAll(this, ['nextPage', 'prevPage', '_onDocumentComplete', 'scaleUp', 'handleInputChange', 'handleInputClick', 'handleInputKeyUp']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;

    this.setState({inputValue: page})
  }
  handleInputClick(e) {
    e.target.select();
  }
  handleInputChange(e) {
    const value = e.target.value;
    this.setState({inputValue: value})
  }
  handleInputKeyUp(e) {
    const { inputValue, pages, page } = this.state;

    if (e.keyCode === 13) {
      const number = parseInt(inputValue);

      if (number && number > 0 && number <= pages) {
        this.setState({page: number})
      } else {
        this.setState({error: true});
        this.setState({inputValue: page});
        setTimeout( () => {
          this.setState({error: false});
        }, 1000)
      }
    }
  }
  prevPage() {
    const { page } = this.state;
    const newPage = page > 1 ? page - 1 : 1

    if (page !== newPage) {
      this.setState({ page: newPage });
      this.setState({inputValue: newPage})
    }
  }
  nextPage() {
    const { page, pages } = this.state;
    const newPage = page < pages ? page + 1 : pages;

    if (page !== newPage) {
      this.setState({ page: newPage });
      this.setState({inputValue: newPage})
    }
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
  renderPagination() {
    const { page, pages, inputValue, error } = this.state;
    let inputClass = 'sw-pdf-viewer__input';
    let disabledButtonLeft = '';
    let disabledButtonRight = '';
    let prev = this.hasPrevPage();
    let next = this.hasNextPage();

    if (error) {
      inputClass += ' sw-pdf-viewer__input--error'
    }

    if (!prev) {
      disabledButtonLeft = 'sw-pdf-viewer__button--disabled'
    }

    if (!next) {
      disabledButtonRight = 'sw-pdf-viewer__button--disabled'
    }

    return (
      <div className="sw-pdf-viewer__action sw-pdf-viewer__action--pagination">
        <div className={"sw-pdf-viewer__button sw-pdf-viewer__button--arrow-left " + disabledButtonLeft} onClick={this.prevPage}>
          <ArrowIcon className="sw-pdf-viewer__icon" />
        </div>

        <input type="text" className={inputClass} value={inputValue} onChange={this.handleInputChange} onClick={this.handleInputClick} onKeyUp={this.handleInputKeyUp}/>
        <div className="sw-pdf-viewer__pages-value">{'of ' + pages}</div>

        <div className={"sw-pdf-viewer__button sw-pdf-viewer__button--arrow-right " + disabledButtonRight} onClick={this.nextPage}>
          <ArrowIcon className="sw-pdf-viewer__icon" />
        </div>
      </div>
    )
  }
  renderZoom() {
    const { scale } = this.state;

    return (
      <div className="sw-pdf-viewer__action sw-pdf-viewer__action--zoom">
        <div className="sw-pdf-viewer__button sw-pdf-viewer__button--zoom-out"></div>
        <div className="sw-pdf-viewer__zoom-value">{scale * 100 + '%'}</div>
        <div className="sw-pdf-viewer__button sw-pdf-viewer__button--zoom-in"></div>
      </div>
    )
  }
  renderActions() {
    const { loaded } = this.state;

    if (!loaded) return;

    return (
      <div className="sw-pdf-viewer__actions">
        {this.renderPagination()}
        {this.renderZoom()}
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
