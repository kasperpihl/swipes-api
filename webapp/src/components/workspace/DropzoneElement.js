import React, { Component, PropTypes } from 'react'

class DropZoneOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { title } = this.props;

    return (
      <div className="swipes-dropzone-element">
      <div className="swipes-dropzone-element__background"></div>
        <div className="swipes-dropzone-element__icon">
          <svg width="45px" height="34px" viewBox="592 388 45 34">
            <path d="M625.75,404.875 C623.88475,404.875 622.375,403.36525 622.375,401.5 C622.375,399.63475 623.88475,398.125 625.75,398.125 C627.61525,398.125 629.125,399.63475 629.125,401.5 C629.125,403.36525 627.61525,404.875 625.75,404.875 M614.5,404.875 C612.63475,404.875 611.125,403.36525 611.125,401.5 C611.125,399.63475 612.63475,398.125 614.5,398.125 C616.36525,398.125 617.875,399.63475 617.875,401.5 C617.875,403.36525 616.36525,404.875 614.5,404.875 M603.25,398.125 C605.11525,398.125 606.625,399.63475 606.625,401.5 C606.625,403.36525 605.11525,404.875 603.25,404.875 C601.38475,404.875 599.875,403.36525 599.875,401.5 C599.875,399.63475 601.38475,398.125 603.25,398.125 M605.5,388 C598.04575,388 592,394.04575 592,401.5 C592,405.12475 593.43775,408.40975 595.762,410.833 L592,421.050171 L610,415 L623.5,415 C630.95425,415 637,408.95425 637,401.5 C637,394.04575 630.95425,388 623.5,388 L605.5,388 Z" stroke="none" fill="#007AFF" fillRule="evenodd"></path>
          </svg>
        </div>
        <div className="swipes-dropzone-element__title">
          {title}
        </div>
      </div>
    )
  }
}

export default DropZoneOverlay

DropZoneOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
}
