import React from 'react';
import SW from './AssigneeContextMenu.swiss';

export default (props) => {
  return (
    <SW.Wrapper onClick={props.hide}>
      <SW.Text>Text</SW.Text>
    </SW.Wrapper>
  )
}