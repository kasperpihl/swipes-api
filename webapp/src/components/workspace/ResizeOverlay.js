import React, { PropTypes } from 'react'

const ResizeOverlay = ({ imageUrl, title, svg }) => {
  var imageHtml = <img src={imageUrl} />;
  if(svg){
    console.log(svg);
    var LogoSlack = svg;
    imageHtml = <LogoSlack />
  }
  return (
    <div className="tile-resizing-overlay">
      <div className="tile-resizing-overlay__content">
        <div className="app-icon">
          { imageHtml }
        </div>
        <div className="app-title">{title}</div>
      </div>
    </div>
  )
}
export default ResizeOverlay

ResizeOverlay.PropTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
}
