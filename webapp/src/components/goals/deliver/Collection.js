import React, { Component, PropTypes } from 'react'
import SwipesCardList from '../../swipes-card/SwipesCardList'

class Collection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log('in the collection', props.step.toJS());
  }
  componentDidMount() {
  }
  renderCardList(){
    const { step } = this.props;
    console.log(steps.get('data'))
  }
  render() {
    return (
      <div>Collection</div>
    )
  }
}
export default Collection

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Collection.propTypes = {
}