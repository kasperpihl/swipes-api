import React, { Component, PropTypes } from 'react'
import SwipesCardList from '../../swipes-card/SwipesCardList'
import Slider from '../../swipes-ui/Slider'

class Collection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderCardLists(){
    const { step } = this.props;
    const cards = step.getIn(['data', 'deliveries']).map((iteration, i) => {
      const data = {
        title: 'Iteration #' + i,
        items: iteration.get('collection').map((del) => {

        }).toArray()
      }
      return <SwipesCardList data={data} key={"cardlist-" + i}/>
    });
    return ( <Slider infinite={true} dots={true}>{cards}</Slider> )

  }
  render() {
    return (
      <div>
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