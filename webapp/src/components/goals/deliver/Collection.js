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
      swipes.do({action: 'add', 'goal_id': goal.get('id'), payload: {url: data.shortUrl}}).then((res, err) => {
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
    const cards = step.getIn(['data', 'iterations']).toArray().map((iteration, i) => {
      return {
        title: 'v' + (i+1),
        items: iteration.get('collection').toArray().map((item) => {
          return { shortUrl: item.get('url') };
        })
      }
      
    });
    return <SwipesCardList data={cards} key={"cardlist"}/>;
    
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