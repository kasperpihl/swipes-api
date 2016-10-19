import React, { Component, PropTypes } from 'react'
import './styles/preview-modal.scss'

class PreviewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="preview-modal">Preview my ass

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
