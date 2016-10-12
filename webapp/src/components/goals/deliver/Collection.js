import React, { Component, PropTypes } from 'react'
import SwipesCardList from '../../swipes-card/SwipesCardList'
import Slider from '../../swipes-ui/Slider'

class Collection extends Component {
  constructor(props) {
    super(props)
    this.clickedAdd = this.clickedAdd.bind(this);
    
  }
  componentDidMount() {
    const { swipes, step, goal } = this.props;
    swipes.addListener('share.receivedData', (data) => {
      console.log('shared data', data);
      swipes.do({action: 'add', 'goal_id': goal.get('id'), payload: {url: data.shareUrl}}).then((res, err) => {
        console.log('ret', res, err);
      })
    }, step.get('id'));
  }
  componentWillUnmount(){
    const { swipes, step } = this.props;
    swipes.removeListener('share.receivedData', null, step.get('id'));
  }
  clickedAdd(){
    const { swipes } = this.props;
    swipes.sendEvent('overlay.set', {component: 'Find', title: 'Find'});
  }
  renderAddButton(){
    return <div onClick={this.clickedAdd}>Add new</div>
  }
  renderCardLists(){
    const { step } = this.props;
    const cards = step.getIn(['data', 'iterations']).map((iteration, i) => {
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
        {this.renderAddButton()}
      </div>
    )
  }
}
export default Collection

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Collection.propTypes = {
}