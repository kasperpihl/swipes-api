import React, { Component, PropTypes } from 'react'
import { isImage, bindAll } from '../../classes/utils'
import { CloseIcon } from '../icons'
import * as Icons from '../icons'
import PDFViewer from '../pdf-viewer/PDFViewer'
import Loader from '../swipes-ui/Loader'

import './styles/preview-modal.scss'

class PreviewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileLoaded: false
    }
    bindAll(this, [ 'fileLoaded', 'closeModal']);
  }
  componentDidMount() {
  }
  closeModal() {
    const { callback } = this.props;

    callback(null);
  }
  renderTopbar() {
    const { title} = this.props;

    return (
      <div className="preview-modal__topbar">
        <div className="preview-modal__close" onClick={this.closeModal}>
          <CloseIcon className="preview-modal__icon" />
        </div>
        <div className="preview-modal__title preview-modal__title--topbar">{title}</div>
        {this.renderActions()}
      </div>
    )
  }
  renderIcon(icon) {
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="preview-modal__icon preview-modal__icon--svg" />;
    }

    return <i className="material-icons preview-modal__icon preview-modal__icon--font">{icon}</i>
  }
  renderActions() {
    const { actions, type } = this.props;

    if (actions && type !== null) {
      const icons = actions.map( (action, i) => {
        return (
          <div key={"action-" + i} className="preview-modal__action" data-content={action.title} onClick={action.onClick}>
            {this.renderIcon(action.icon)}
          </div>
        )
      })

      return (
        <div className="preview-modal__actions">
          {icons}
        </div>
      )
    }

    if (actions && type === null) {
      const icons = actions.map( (action, i) => {
        return (
          <div key={"action-" + i} className="preview-modal__action" onClick={action.onClick}>
            {this.renderIcon(action.icon)}
            <div className="preview-modal__title preview-modal__title--action">{action.title}</div>
          </div>
        )
      })

      return (
        <div className="preview-modal__actions">
          {icons}
        </div>
      )
    }
  }
  fileLoaded() {
    const { loaded } = this.state;

    this.setState({loaded: true});
  }
  renderPDF() {
    const { pdf } = this.props;
    const { loaded } = this.state;

    if(!pdf || !loaded) return;

    return (
      <div className="preview-modal__pdf">
        <PDFViewer file={pdf} fileLoaded={this.fileLoaded}/>
      </div>
    )
  }
  renderImage() {
    const { img } = this.props;
    const { loaded } = this.state;

    if(!img) return;

    let imageClass = 'preview-modal__image';

    if (loaded) {
      imageClass += ' preview-modal__image--shown'
    }

    return (
      <div className={imageClass} onLoad={this.fileLoaded}>
        <img src={img} />
      </div>
    )
  }
  renderEmpty() {
    const { type, actions, title } = this.props;
    const { loaded } = this.state;

    if (type === null && !loaded) {

      return (
        <div className="preview-modal__empty">
          <div className="preview-modal__title preview-modal__title--empty">{title}</div>
          {this.renderActions()}
        </div>
      )
    }

  }
  renderLoader() {
    const { loaded } = this.state;
    const { type } = this.props;

    if (!loaded && type !== null) {
      return <Loader center={true} />
    }
  }
  render() {
    const { type } = this.props;
    let className = 'preview-modal';

    if (type === null) {
      className += ' preview-modal--empty'
    }

    return (
      <div className={className}>
        {this.renderTopbar()}
        {this.renderImage()}
        {this.renderPDF()}
        {this.renderEmpty()}
        {this.renderLoader()}
      </div>
    )
  }
}

export default PreviewModal

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

PreviewModal.propTypes = {
  img: string,
  pdf: string
}
