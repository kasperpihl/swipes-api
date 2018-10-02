import React, { PureComponent } from 'react';
import SW from './DragAndDrop.swiss';

class DragAndDrop extends PureComponent {
  render() {
    const {
      children,
      hoverActive,
      showMenu,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
      handleDragOver,
      closeOverlay,
      handleItemClick,
      onDiscuss,
    } = this.props;

    return (
      <SW.Wrapper onDragEnter={handleDragEnter}>
        <SW.Overlay
          shown={hoverActive}
          onClick={closeOverlay}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <SW.OverlayTitle>Drop anywhere.</SW.OverlayTitle>
        </SW.Overlay>
        {children}
      </SW.Wrapper>
    );
  }
}

export default DragAndDrop;
