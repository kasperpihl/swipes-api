import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
// import SwipesCardList from '../swipes-card/SwipesCardList';

import './styles/collection.scss';

class Collection extends Component {
  renderCardLists() {
    // const { step, cardDelegate } = this.props;

    // const cards = step.getIn(['data', 'iterations']).toArray().map((iteration, i) => ({
    //   title: `v${i + 1}`,
    //   items: iteration.get('collection').toArray().map(item => ({ shortUrl: item.get('url') })),
    // }));
    //
    // return <SwipesCardList delegate={cardDelegate} data={cards} key={'cardlist'} />;
  }
  render() {
    return (
      <div className="goal-decisions">
        {this.renderCardLists()}
      </div>
    );
  }
}
export default Collection;

const { object } = PropTypes;

Collection.propTypes = {
  step: map,
  cardDelegate: object,
};
