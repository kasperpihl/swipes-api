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
    const iconUrl = '/workflows/' + data.workflow.manifest_id + '/dev/' + data.workflow.icon;

    return <div className="shared-card">
      <div className="dot-wrapper">
        <div className="dot"></div>
      </div>
      <div className="title">{data.title}</div>
      <div className="service-icon-wrapper">
        <img src={iconUrl} alt="" />
      </div>
    </div>
  }
}

export {
  SwipesCardProvider as Provider,
  SwipesCard as Card
}
