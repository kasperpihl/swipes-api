import React, {Component} from 'react';
import SW from './DragAndDrop.swiss';

class DragAndDrop extends Component {

  render() {
    const { children, hoverActive, showMenu, handleDragEnter, handleDragLeave, handleDrop, handleDragOver, closeOverlay, handleItemClick, onDiscuss } = this.props;
    return (
      <SW.Wrapper
      onDragEnter={handleDragEnter}
      >
        <SW.Overlay
        shown={hoverActive}
        onClick={closeOverlay}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
        </SW.Overlay>
        <SW.MenuWrapper showMenu={showMenu}>
          <SW.MenuList>
            <SW.ListItem onClick={onDiscuss}>
              <SW.ItemIcon icon='ESArrow' />
              <SW.Description>
                <SW.Title>
                Start a discussion
                </SW.Title>
                <SW.Subtitle>
                Start a discussion with the attached file.
              </SW.Subtitle>
              </SW.Description>
            </SW.ListItem>
            <SW.ListItem onClick={handleItemClick}>
              <SW.ItemIcon icon='ESArrow' />
              <SW.Description>
                <SW.Title>
                Attach file
                </SW.Title>
                <SW.Subtitle>
                Attach file to current goal/step/plan
              </SW.Subtitle>
              </SW.Description>
            </SW.ListItem>
            <SW.ListItem onClick={handleItemClick}>
              <SW.ItemIcon icon='ESArrow' />
              <SW.Description>
                <SW.Title>
                Start a discussion
                </SW.Title>
                <SW.Subtitle>
                Start a discussion with the attached file.
              </SW.Subtitle>
              </SW.Description>
            </SW.ListItem>
            <SW.ListItem onClick={handleItemClick}>
              <SW.ItemIcon icon='ESArrow' />
              <SW.Description>
                <SW.Title>
                Start a discussion
                </SW.Title>
                <SW.Subtitle>
                Start a discussion with the attached file.
              </SW.Subtitle>
              </SW.Description>
            </SW.ListItem>
          </SW.MenuList>
        </SW.MenuWrapper>
        {children}
      </SW.Wrapper>
    )
  }
}

export default DragAndDrop;

