import React, { Component, PropTypes } from 'react'
import { isImage, bindAll } from '../../classes/utils'
import { EarthIcon, CloseIcon, DesktopIcon, DownloadIcon } from '../icons'
import PDFViewer from '../pdf-viewer/PDFViewer'

import './styles/preview-modal.scss'

class PreviewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, ['clickedDownload', 'clickedOpenDesktop']);
  }
  componentDidMount() {
  }
  renderTopbar() {
    const { title} = this.props;

    return (
      <div className="preview-modal__topbar">
        <div className="preview-modal__close">
          <CloseIcon className="preview-modal__icon" />
        </div>
        <div className="preview-modal__title">{title}</div>
        {this.renderActions()}
      </div>
    )
  }
  renderIcon(icon) {
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="preview-modal__icon preview-modal__icon--svg"/>;
    }

    return <i className="material-icons preview-modal__icon preview-modal__icon--font">{icon}</i>
  }
  clickedDownload(){
  }
  clickedOpenDesktop(){
    this.props.callback('download');

  }
  renderActions() {

    return (
      <div className="preview-modal__actions">
        <div className="preview-modal__action" data-content="Open in Dropbox.com">
          <EarthIcon className="preview-modal__icon" />
        </div>
        <div onClick={this.clickedOpenDesktop} className="preview-modal__action" data-content="Open on Desktop">
          <DesktopIcon className="preview-modal__icon" />
        </div>
        <div onClick={this.clickedDownload} className="preview-modal__action" data-content="Download">
          <DownloadIcon className="preview-modal__icon" />
        </div>
      </div>
    )
  }
  renderPDF() {
    const { pdf } = this.props;

    if(!pdf) return;

    return (
      <div className="preview-modal__pdf">
        <PDFViewer file={pdf} />
      </div>
    )
  }
  renderImage() {
    const { img } = this.props;

    if(!img) return;

    return (
      <div className="preview-modal__image">
        <img src={img} />
      </div>
    )
  }
  render() {
    let className = 'preview-modal'

    return (
      <div className={className}>
        {this.renderTopbar()}
        {this.renderImage()}
        {this.renderPDF()}
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
