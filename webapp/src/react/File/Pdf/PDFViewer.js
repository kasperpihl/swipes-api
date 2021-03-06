import React, { PureComponent } from 'react';
import Icon from 'src/react/_components/Icon/Icon';

import PDFRender from './PDFRender';

import './styles/pdf-viewer.scss';

class PDFViewer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pages: 0,
      scale: 1,
      loaded: false,
      inputValue: 1,
      error: false,
      shown: true,
      actionHover: false
    };
  }
  componentWillMount() {
    // const { page } = this.state;

    this.timeout = setTimeout(() => {
      this.setState({ shown: false });
    }, 4000);
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  onDocumentComplete = ({ pdfInfo }) => {
    console.log(pdfInfo);
    const { fileLoaded } = this.props;
    const { loaded } = this.state;

    this.setState({ pages: pdfInfo.numPages });
    this.setState({ loaded: true });

    if (fileLoaded) {
      fileLoaded(loaded);
    }
  };
  handleInputClick(e) {
    e.target.select();
  }
  handleInputChange = e => {
    const value = e.target.value;
    this.setState({ inputValue: value });
  };
  handleInputKeyUp = e => {
    const { inputValue, pages, page } = this.state;

    if (e.keyCode === 13) {
      const number = parseInt(inputValue, 10);

      if (number && number > 0 && number <= pages) {
        this.setState({ page: number });
      } else {
        this.setState({ error: true });
        this.setState({ inputValue: page });

        setTimeout(() => {
          this.setState({ error: false });
        }, 1000);
      }
    }
  };
  handleMouseMove = () => {
    window.clearTimeout(this.timeout);
    this.setState({ shown: true });

    if (this.state.actionHover) return;

    this.timeout = setTimeout(() => {
      this.setState({ shown: false });
    }, 2000);
  };
  handleMouseEnter = () => {
    window.clearTimeout(this.timeout);
    this.setState({ actionHover: true });
  };
  handleMouseLeave = () => {
    this.setState({ actionHover: false });

    this.timeout = setTimeout(() => {
      this.setState({ shown: false });
    }, 2000);
  };
  prevPage = () => {
    const { page } = this.state;
    const newPage = page > 1 ? page - 1 : 1;

    if (page !== newPage) {
      this.setState({ page: newPage });
      this.setState({ inputValue: newPage });
    }
  };
  nextPage = () => {
    const { page, pages } = this.state;
    const newPage = page < pages ? page + 1 : pages;

    if (page !== newPage) {
      this.setState({ page: newPage });
      this.setState({ inputValue: newPage });
    }
  };
  hasNextPage() {
    const { page, pages } = this.state;

    return page < pages;
  }
  hasPrevPage() {
    const { page } = this.state;

    return page > 1;
  }
  scaleUp = () => {
    const newScale = this.state.scale + 0.2;

    this.setState({ scale: newScale });
  };
  scaleDown = () => {
    const newScale = this.state.scale - 0.2;

    this.setState({ scale: newScale });
  };
  renderPagination() {
    const { pages, inputValue, error } = this.state;
    const prev = this.hasPrevPage();
    const next = this.hasNextPage();
    let inputClass = 'sw-pdf-viewer__input';
    let arrowButtonLeft = 'sw-pdf-viewer__button';
    let arrowButtonRight = 'sw-pdf-viewer__button';

    if (error) {
      inputClass += ' sw-pdf-viewer__input--error';
    }

    if (!prev) {
      arrowButtonLeft += ' sw-pdf-viewer__button--disabled';
    }

    if (!next) {
      arrowButtonRight += ' sw-pdf-viewer__button--disabled';
    }

    return (
      <div className="sw-pdf-viewer__action">
        <div className={arrowButtonLeft} onClick={this.prevPage}>
          <Icon icon="ArrowLeftLine" className="sw-pdf-viewer__icon" />
        </div>

        <input
          type="text"
          className={inputClass}
          value={inputValue}
          onChange={this.handleInputChange}
          onClick={this.handleInputClick}
          onKeyUp={this.handleInputKeyUp}
        />
        <div className="sw-pdf-viewer__pages-value">
          <span>of </span>
          {` ${pages}`}
        </div>

        <div className={arrowButtonRight} onClick={this.nextPage}>
          <Icon icon="ArrowRightLine" className="sw-pdf-viewer__icon" />
        </div>
      </div>
    );
  }
  renderZoom() {
    const { scale } = this.state;

    return (
      <div className="sw-pdf-viewer__action">
        <div className="sw-pdf-viewer__button" onClick={this.scaleDown}>
          <Icon icon="Minus" className="sw-pdf-viewer__icon" />
        </div>
        <div className="sw-pdf-viewer__zoom-value">{`${Math.round(
          scale * 100
        )}%`}</div>
        <div className="sw-pdf-viewer__button" onClick={this.scaleUp}>
          <Icon icon="Plus" className="sw-pdf-viewer__icon" />
        </div>
      </div>
    );
  }
  renderActions() {
    const { loaded, shown } = this.state;

    if (!loaded) return undefined;

    let className = 'sw-pdf-viewer__actions';

    if (shown) {
      className += ' sw-pdf-viewer__actions--shown';
    }

    return (
      <div
        className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.renderPagination()}
        {this.renderZoom()}
      </div>
    );
  }
  render() {
    const { file } = this.props;
    const { page } = this.state;

    return (
      <div className="sw-pdf-viewer" onMouseMove={this.handleMouseMove}>
        <div className="sw-pdf-viewer__pdf">
          <PDFRender
            file={file}
            scale={this.state.scale}
            onDocumentComplete={this.onDocumentComplete}
            page={page - 1}
          />
        </div>
        {this.renderActions()}
      </div>
    );
  }
}
export default PDFViewer;
