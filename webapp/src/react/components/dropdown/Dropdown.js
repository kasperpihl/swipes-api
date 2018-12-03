import React, { Component } from 'react';
import SW from './Dropdown.swiss';
import { SwissProvider } from 'swiss-react';

export default class Dropdown extends Component {
  constructor(props){
    super(props)

    this.state = {
      showDropdown: false,
      selectedRow: [],
    }
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown })
  }
  
  handleRowClick = (id) => {
    const { selectedRow } = this.state;
    if (selectedRow.includes(id)) {
      const newArr = selectedRow.filter((v) => {
        return v !== id;
      }) 
      this.setState({ selectedRow: newArr });
    } else { 
      let arr = selectedRow;
      arr.push(id);
      this.setState({ selectedRow: arr });
    }
  }

  render() {
    const { selectedRow } = this.state;
    const { rounded } = this.props;
    console.log(selectedRow);
    
    return ( 
      <SwissProvider rounded={rounded}>
        <SW.Wrapper>
          <SW.Background onClick={this.toggleDropdown}>
            <SW.Text>Text</SW.Text>
            <SW.Icon icon='ArrowLeftLine' width='24' show={this.state.showDropdown} arrow />
          </SW.Background>
          <SW.DropdownBox show={this.state.showDropdown}>
            <SW.Row onClick={() => this.handleRowClick(1)} selected={selectedRow.includes(1)}>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
            <SW.Row onClick={() => this.handleRowClick(2)} selected={selectedRow.includes(2)}>
              <SW.Icon icon='ArrowRightLine' width='24' row/>
              <SW.RowText>Row Text Here</SW.RowText>
            </SW.Row>
          </SW.DropdownBox>
        </SW.Wrapper>
      </SwissProvider>
    )
  }
}