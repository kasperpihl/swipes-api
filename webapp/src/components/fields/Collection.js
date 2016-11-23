import React, { Component, PropTypes } from 'react'
import SwipesCardList from '../swipes-card/SwipesCardList'

import './styles/collection.scss'

class Collection extends Component {
  static getIcon(){
    return 'ArrowRightIcon'
  }
  constructor(props) {
    super(props)
  }
  renderCardLists() {
    const { step, cardDelegate } = this.props;
    return;
    const cards = step.getIn(['data', 'iterations']).toArray().map((iteration, i) => {
      return {
        title: 'v' + (i+1),
        items: iteration.get('collection').toArray().map((item) => {
          return { shortUrl: item.get('url') };
        })
      }
    });

    return <SwipesCardList delegate={cardDelegate} data={cards} key={"cardlist"} />;
  }
  render() {
    return (
      <div className="goal-decisions">
        {this.renderCardLists()}
      </div>
    )
  }
}
export default Collection

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Collection.propTypes = {
}
