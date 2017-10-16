import React, { Component } from 'react';
import Icon from 'Icon';
import './styles/swipes-loader.scss';

class SwipesLoader extends Component {
  render() {
    return (
      <div className="sw-loader-wrap">
        <Icon icon="SwipesLogoEmpty" className="sw-loader-wrap__svg" />
      </div>
    );
  }
}

export default SwipesLoader;
