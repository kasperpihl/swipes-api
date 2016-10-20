import React, { Component, PropTypes } from 'react'
import Loader from '../swipes-ui/Loader'
import { isImage, bindAll } from '../../classes/utils'
import './styles/preview-modal.scss'

class PreviewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
    bindAll(this, ['fileLoaded']);
  }
  componentDidMount() {
  }
  fileLoaded() {
    console.log('loaded');
    this.setState({loaded: true})
  }
  renderContent(file) {

    if (isImage(file)) {
      return (
        <div className="preview-modal__image">
          <img src={file} onLoad={this.fileLoaded}/>
        </div>
      )
    }
  }
  renderLoader() {

    if (!this.state.loaded) {
      // return <Loader center={true} />
    }
  }
  render() {

    return (
      <div className="preview-modal">
        {this.renderLoader()}
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
