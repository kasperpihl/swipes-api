import React from 'react'

const ResizeOverlay = ({ imageUrl, title }) => (
  <div className="tile-resizing-overlay">
    <div className="tile-resizing-overlay__content">
      <div className="app-icon">
        <img src={imageUrl} />
      </div>
      <div className="app-title">{title}</div>
    </div>
  </div>
)

export default ResizeOverlay


