'use strict'

import React from 'react';
import SwipesDot from 'swipes-dot';

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
    const elements = data.swipesDotActions.map((row) => {
      const mappedRow = row.map((action) => {
        action.callback = () => {
          console.log('Hey there');
        }

        return action;
      })

      return mappedRow;
    })

    // T_TODO put a unique id here
    // we will need that when we start doing collections
    // <div className="dot"></div>
    return <div id="card-container" className="shared-card">
      <div className="dot-wrapper">
        <SwipesDot
          hoverParentId='card-container'
          elements={elements} />
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
