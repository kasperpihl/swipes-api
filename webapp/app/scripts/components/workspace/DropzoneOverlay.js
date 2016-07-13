import React, { PropTypes } from 'react'

const DropzoneOverlay = ({ hover, title }) => {
  let className = "tile-dropzone-overlay"
  if(hover){
    className += " hover"
  }
  title = title || "Share"
  return (
    <div className={className}>
      <div className="background" />
      <div className="center">
        <h6><span>{title}</span></h6>
      </div>
    </div>
  )
}

export default DropzoneOverlay

DropzoneOverlay.propTypes = {
  title: PropTypes.string.isRequired
}