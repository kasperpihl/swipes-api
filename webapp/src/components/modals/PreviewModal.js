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
    bindAll(this, [ 'fileLoaded']);
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
      return <Comp className="preview-modal__icon preview-modal__icon--svg" />;
    }

    return <i className="material-icons preview-modal__icon preview-modal__icon--font">{icon}</i>
  }
  renderActions() {
    const { actions } = this.props;

    if (actions) {
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
  }
  fileLoaded() {
    const { loaded } = this.state;

    this.setState({loaded: true});
  }
  renderPDF() {
    const { pdf } = this.props;
    const { loaded } = this.state;

    if(!pdf && !loaded) return;

    return (
      <div className="preview-modal__pdf">
        <PDFViewer file={pdf} fileLoaded={this.fileLoaded}/>
      </div>
    )
  }
  renderImage() {
    const { img } = this.props;
    const { loaded } = this.state;

    if(!img && !loaded) return;

    return (
      <div className="preview-modal__image">
        <img src={img} />
      </div>
    )
  }
  renderLoader() {
    const { loaded } = this.state;

    if (!loaded) {
      return <Loader center={true} />
    }
  }
  render() {
    let className = 'preview-modal'

    return (
      <div className={className}>
        {this.renderTopbar()}
        {this.renderImage()}
        {this.renderPDF()}

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
