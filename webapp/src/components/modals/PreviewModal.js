import React, { Component, PropTypes } from 'react';
import { bindAll } from '../../classes/utils';
import Icon from '../icons/Icon';
import PDFViewer from '../pdf-viewer/PDFViewer';
import Loader from '../swipes-ui/Loader';

import './styles/preview-modal.scss';

class PreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileLoaded: false,
    };
    bindAll(this, ['fileLoaded', 'closeModal']);
  }
  componentDidMount() {
  }
  closeModal() {
    const { callback } = this.props;

    callback(null);
  }
  fileLoaded() {
    this.setState({ loaded: true });
  }
  renderTopbar() {
    const { title } = this.props;

    return (
      <div className="preview-modal__topbar">
        <div className="preview-modal__close" onClick={this.closeModal}>
          {this.renderIcon('CloseIcon')}
        </div>
        <div className="preview-modal__title preview-modal__title--topbar">{title}</div>
        {this.renderActions()}
      </div>
    );
  }
  renderIcon(icon) {
    return <Icon svg={icon} className="preview-modal__icon preview-modal__icon--svg" />;
  }
  renderActions() {
    const { actions, type } = this.props;

    if (actions && type !== null) {
      const icons = actions.map((action, i) => (
        <div key={`action-${i}`} className="preview-modal__action" data-content={action.title} onClick={action.onClick}>
          {this.renderIcon(action.icon)}
        </div>
        ));

      return (
        <div className="preview-modal__actions">
          {icons}
        </div>
      );
    }

    if (actions && type === null) {
      const icons = actions.map((action, i) => (
        <div key={`action-${i}`} className="preview-modal__action" onClick={action.onClick}>
          {this.renderIcon(action.icon)}
          <div className="preview-modal__title preview-modal__title--action">{action.title}</div>
        </div>
        ));

      return (
        <div className="preview-modal__actions">
          {icons}
        </div>
      );
    }

    return undefined;
  }
  renderPDF() {
    const { pdf } = this.props;
    const { loaded } = this.state;
    let className = 'preview-modal__pdf';

    if (!pdf) return undefined;

    if (loaded) {
      className += ' preview-modal__pdf--shown';
    }

    return (
      <div className={className}>
        <PDFViewer file={pdf} fileLoaded={this.fileLoaded} />
      </div>
    );
  }
  renderImage() {
    const { img } = this.props;
    const { loaded } = this.state;

    if (!img) return undefined;

    let imageClass = 'preview-modal__image';

    if (loaded) {
      imageClass += ' preview-modal__image--shown';
    }

    return (
      <div className={imageClass} onLoad={this.fileLoaded}>
        <img src={img} role="presentation" />
      </div>
    );
  }
  renderEmpty() {
    const { type, title } = this.props;
    const { loaded } = this.state;

    if (type === null && !loaded) {
      return (
        <div className="preview-modal__empty">
          <div className="preview-modal__title preview-modal__title--empty">{title}</div>
          {this.renderActions()}
        </div>
      );
    }

    return undefined;
  }
  renderLoader() {
    const { loaded } = this.state;
    const { type } = this.props;

    if (!loaded && type !== null) {
      return <Loader center />;
    }

    return undefined;
  }
  render() {
    const { type } = this.props;
    let className = 'preview-modal';

    if (type === null) {
      className += ' preview-modal--empty';
    }

    return (
      <div className={className}>
        {this.renderTopbar()}
        {this.renderImage()}
        {this.renderPDF()}
        {this.renderEmpty()}
        {this.renderLoader()}
      </div>
    );
  }
}

export default PreviewModal;

const { string, func, array } = PropTypes;

PreviewModal.propTypes = {
  img: string,
  pdf: string,
  callback: func,
  title: string,
  actions: array,
  type: string,
};
