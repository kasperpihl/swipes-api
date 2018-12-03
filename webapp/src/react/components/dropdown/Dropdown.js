import React, { Component } from 'react';
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
            <SW.Icon icon='ArrowLeftLine' width='24' show={this.state.showDropdown} arrow />
          </SW.Background>
          <SW.DropdownBox show={this.state.showDropdown}>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
          </SW.DropdownBox>
        </SW.Wrapper>
      </SwissProvider>
    )
  }
}