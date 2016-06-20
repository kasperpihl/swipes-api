'use strict'

import React from 'react';

const SwipesCardProvider = (ComposedComponent) => class extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <ComposedComponent {...this.props} />
  }
}

const SwipesCard = class extends React.Component {
  render () {
    const {
      data
    } = this.props;

    return <div className="shared-card">
      <div className="dot-wrapper">
        <div className="dot"></div>
      </div>
      <div className="title">{data.title}</div>
      <div className="service-icon-wrapper">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/170179/logo-dropbox.svg" alt="" />
      </div>
    </div>
  }
}

export {
  SwipesCardProvider as Provider,
  SwipesCard as Card
}
