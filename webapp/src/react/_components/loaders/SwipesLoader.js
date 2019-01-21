import React, { Component } from 'react';
import SW from './SwipesLoader.swiss'

class SwipesLoader extends Component {
  render() {
    return (
      <SW.Wrapper>
        <SW.Icon icon="SwipesLogoEmpty"/>
      </SW.Wrapper>
    );
  }
}

export default SwipesLoader;
