import React, { Component, PropTypes } from 'react'
import { isImage, bindAll } from '../../classes/utils'
import { EarthIcon, CloseIcon, DesktopIcon, DownloadIcon } from '../icons'
import './styles/preview-modal.scss'

class PreviewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderTopbar() {

    return (
      <div className="preview-modal__topbar">
        <div className="preview-modal__close">
          <CloseIcon className="preview-modal__icon" />
        </div>
        <div className="preview-modal__title">Lorem_ipsum_dolor_sit_amet.png</div>
        {this.renderActions()}
      </div>
    )
  }
  renderActions() {

    return (
      <div className="preview-modal__actions">
        <div className="preview-modal__action" data-content="Open in Dropbox.com">
          <EarthIcon className="preview-modal__icon" />
        </div>
        <div className="preview-modal__action" data-content="Open on Desktop">
          <DesktopIcon className="preview-modal__icon" />
        </div>
        <div className="preview-modal__action" data-content="Download">
          <DownloadIcon className="preview-modal__icon" />
        </div>
      </div>
    )
  }
  renderContent(file) {

    if (isImage(file)) {
      return (
        <div className="preview-modal__image">
          <img src={file} />
        </div>
      )
    }
  }
  render() {

    let className = 'preview-modal'

    return (
      <div className={className}>
        {this.renderTopbar()}
        {this.renderContent(this.props.data)}
      </div>
    )
  }
}
export default PreviewModal

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

PreviewModal.propTypes = {
  // removeThis: string.isRequired
}
