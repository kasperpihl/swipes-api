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

    //console.log(window);
    //const swipesSDK = swipes || null;
    const iconUrl = '/workflows/' + data.workflow.manifest_id + '/dev/' + data.workflow.icon;
    const elements = data.serviceActions.map((row) => {
      const mappedRow = row.map((action) => {
        // If we are at the client and swipes sdk is defined
        if (typeof swipes !== 'undefined') {
            action.callback = () => {
              swipes.service('asana').request(action.method, action.data)
                .then(function () {
                  console.log('YEAH!!!');
                })
                .catch(function(err) {
                  console.log(err);
                })
            }
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
      <div className="title">{data.serviceData.title}</div>
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
