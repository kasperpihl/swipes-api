import React, { Component, PropTypes } from 'react'
import PDF from 'react-pdf'
import { ArrowLeftIcon, ArrowRightIcon, AddIcon, MinusIcon } from '../icons'
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
      error: false,
      shown: true,
      actionHover: false
    }

    bindAll(this, ['nextPage', 'prevPage', '_onDocumentComplete', 'scaleUp', 'scaleDown', 'handleInputChange', 'handleInputClick', 'handleInputKeyUp', 'handleMouseMove', 'handleMouseEnter', 'handleMouseLeave']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;

    this.setState({inputValue: page});
    this.timeout = setTimeout( () => {
      this.setState({shown: false})
    }, 4000);
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
  handleMouseMove() {
    window.clearTimeout(this.timeout);
    this.setState({shown: true});

    if (this.state.actionHover) return;

    this.timeout = setTimeout( () => {
      this.setState({shown: false})
    }, 2000)
  }
  handleMouseEnter() {
    console.log('do you get here');
    window.clearTimeout(this.timeout);
    this.setState({actionHover: true});

  }
  handleMouseLeave() {
    this.setState({actionHover: false});

    this.timeout = setTimeout( () => {
      this.setState({shown: false})
    }, 2000)
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
    const newScale = this.state.scale + .2;

    this.setState({scale: newScale})
  }
  scaleDown() {
    const newScale = this.state.scale - .2;

    this.setState({scale: newScale})
  }
  renderPagination() {
    const { page, pages, inputValue, error } = this.state;
    let inputClass = 'sw-pdf-viewer__input';
    let arrowButtonLeft = 'sw-pdf-viewer__button';
    let arrowButtonRight = 'sw-pdf-viewer__button';
    let prev = this.hasPrevPage();
    let next = this.hasNextPage();

    if (error) {
      inputClass += ' sw-pdf-viewer__input--error'
    }

    if (!prev) {
      arrowButtonLeft += ' sw-pdf-viewer__button--disabled'
    }

    if (!next) {
      arrowButtonRight += ' sw-pdf-viewer__button--disabled'
    }

    return (
      <div className="sw-pdf-viewer__action">
        <div className={arrowButtonLeft} onClick={this.prevPage}>
          <ArrowLeftIcon className="sw-pdf-viewer__icon" />
        </div>

        <input type="text" className={inputClass} value={inputValue} onChange={this.handleInputChange} onClick={this.handleInputClick} onKeyUp={this.handleInputKeyUp}/>
        <div className="sw-pdf-viewer__pages-value"><span>of </span>{' ' + pages}</div>

        <div className={arrowButtonRight} onClick={this.nextPage}>
          <ArrowRightIcon className="sw-pdf-viewer__icon" />
        </div>
      </div>
    )
  }
  renderZoom() {
    const { scale } = this.state;

    return (
      <div className="sw-pdf-viewer__action">
        <div className="sw-pdf-viewer__button" onClick={this.scaleUp}>
          <AddIcon className="sw-pdf-viewer__icon" />
        </div>
        <div className="sw-pdf-viewer__zoom-value">{Math.round(scale * 100) + '%'}</div>
        <div className="sw-pdf-viewer__button" onClick={this.scaleDown}>
          <MinusIcon className="sw-pdf-viewer__icon" />
        </div>
      </div>
    )
  }
  renderActions() {
    const { loaded, shown } = this.state;

    if (!loaded) return;

    let className = 'sw-pdf-viewer__actions'

    if (shown) {
      className += ' sw-pdf-viewer__actions--shown'
    }

    return (
      <div className={className} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {this.renderPagination()}
        {this.renderZoom()}
      </div>
    )
  }
  render() {
    const { file } = this.props;
    const { page } = this.state;

    return (
      <div className="sw-pdf-viewer" onMouseMove={this.handleMouseMove}>
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
