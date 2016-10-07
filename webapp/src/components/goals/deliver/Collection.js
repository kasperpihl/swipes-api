import React, { Component, PropTypes } from 'react'
import SwipesCardList from '../../swipes-card/SwipesCardList'
import Slider from '../../swipes-ui/Slider'

class Collection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log('in the collection', props.step.toJS());
  }
  componentDidMount() {
  }
  renderCardLists(){
    const { step } = this.props;
    console.log(step.getIn(['data', 'deliveries']).toJS());
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