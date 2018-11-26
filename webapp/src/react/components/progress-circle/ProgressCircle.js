import React, { Component } from 'react';
import SW from './ProgressCircle.swiss';

const ProgressCircle = (props) => {
  return (
    <SW.Wrapper>
      <SW.Fill prog={22}/> 
    </SW.Wrapper>
  )
}

export default ProgressCircle