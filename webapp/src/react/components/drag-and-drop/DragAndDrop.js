import React, {Component} from 'react';
import SW from './DragAndDrop.swiss';


class DragAndDrop extends Component {
  constructor(props){
    super(props);

    this.state = {
      hoverActive: false,
      dropActive: false,
      showMenu: false,
    }
  }

  handleDragEnter = (e) => {
    e.preventDefault();
    let dt = e.dataTransfer;
    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
      this.setState({hoverActive: true})
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    this.setState({hoverActive: false});
  }

  handleDragOver = (e) => {
    e.preventDefault();
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({showMenu: true});
  }

  handleItemClick = (e) => {
    e.preventDefault();
    this.setState({hoverActive: false});
    this.setState({showMenu: false});
  }

  closeOverlay = () => {
    this.setState({hoverActive: false});
    this.setState({showMenu: false});
  }

  render() {
    const { hoverActive, showMenu } = this.state;
    const { children } = this.props;
    return (
      <SW.Wrapper
      onDragEnter={this.handleDragEnter}
      >
        <SW.Overlay
        shown={hoverActive}
        onClick={this.closeOverlay}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
        >
        </SW.Overlay>
        <SW.MenuWrapper showMenu={showMenu}>
          <SW.MenuList>
            <SW.ListItem onClick={this.handleItemClick}>
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
            <SW.ListItem onClick={this.handleItemClick}>
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
            <SW.ListItem onClick={this.handleItemClick}>
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
            <SW.ListItem onClick={this.handleItemClick}>
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

