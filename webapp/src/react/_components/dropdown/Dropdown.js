import React, { useState } from 'react';
import SW from './Dropdown.swiss';

export default function Dropdown({ rounded, items, onChange }) {
  const [showDropdown, handleShowDropdown] = useState(false);
  const [selectedRow, handleRowChange] = useState(0);

  const toggleDropdown = () => {
    handleShowDropdown(!showDropdown);
  };

  const handleRowClick = key => {
    handleRowChange(key);
    onChange(key);
    toggleDropdown();
  };

  return (
    <SW.ProvideContext rounded={rounded}>
      <SW.Wrapper>
        <SW.Background onClick={toggleDropdown}>
          <SW.Text>{items[selectedRow].title}</SW.Text>
          <SW.Icon icon="ArrowDown" width="24" show={showDropdown} arrow />
        </SW.Background>
        <SW.DropdownBox show={showDropdown}>
          {items.map((item, i) => {
            return (
              <SW.Row
                key={`${item}-${i}`}
                onClick={() => handleRowClick(i)}
                selected={selectedRow === i}
              >
                <SW.RowText>{item.title}</SW.RowText>
              </SW.Row>
            );
          })}
        </SW.DropdownBox>
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
