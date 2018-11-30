import React, { Component } from 'react';
import Icon from 'src/react/icons/Icon';
import SW from './Dropdown.swiss';
import { SwissProvider } from 'swiss-react';

export default class Dropdown extends Component {
  constructor(props){
    super(props)

    this.state = {
      showDropdown: false,
    }
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  render() {
    const { rounded } = this.props;
    
    return ( 
      <SwissProvider rounded={rounded}>
        <SW.Wrapper>
          <SW.Background onClick={this.toggleDropdown}>
            <SW.Text>Text</SW.Text>
            <Icon icon='ThreeDots' width='24' />
          </SW.Background>
          <SW.DropdownBox show={this.state.showDropdown}>
            here
          </SW.DropdownBox>
        </SW.Wrapper>
      </SwissProvider>
    )
  }
}