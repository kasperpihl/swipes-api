import React, { Component } from 'react';
import Icon from 'Icon';
import './styles/swipes-loader.scss';

class SwipesLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="sw-loader-wrap">
        <Icon svg="SwipesLogoEmpty" className="sw-loader-wrap__svg" />
      </div>
    );
  }
}

export default SwipesLoader;
