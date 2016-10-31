import React, { Component, PropTypes } from 'react'
import SwipesCardList from '../../swipes-card/SwipesCardList'
import GoalStepAction from '../GoalStepAction'
import Slider from '../../swipes-ui/Slider'
import Button from '../../swipes-ui/Button'

import '../styles/collection.scss'

class Collection extends Component {
  constructor(props) {
    super(props)
    this.clickedAdd = this.clickedAdd.bind(this);
    this.clickedSubmit = this.clickedSubmit.bind(this);
  }
  componentDidMount() {
    const { swipes, step, goal } = this.props;
    swipes.addListener('share.receivedData', (data) => {
      swipes.do({action: 'add', 'goal_id': goal.get('id'), payload: {url: data.shortUrl}}).then((res, err) => {
        console.log('ret', res, err);
      })
    }, step.get('id'));
  }
  componentWillUnmount() {
    const { swipes, step } = this.props;
    swipes.removeListener('share.receivedData', null, step.get('id'));
  }
  clickedAdd() {
    const { swipes } = this.props;
    swipes.sendEvent('overlay.set', {component: 'Find', title: 'Find'});
  }
  clickedSubmit(){
    const { step, completeStep } = this.props;

    completeStep(step.get('id'));
  }
  renderAddButton() {
    return <Button title="Upload" callback={this.clickedAdd} style={{marginTop: '30px'}} />
  }
  renderCardLists() {
    const { step, cardDelegate } = this.props;
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
  renderSubmit() {
    const { step } = this.props;

    if (!step.get('completed')) {
      return <Button title="Next" callback={this.clickedSubmit} style={{marginLeft: '15px', marginTop: '30px'}} />
    }
  }
  render() {

    const goalAction = {
      icon: 'DeliverIcon',
      title: 'Deliver Icons',
      buttons: [
        {
          label: 'upload',
          callback: this.clickedAdd
        },
        {
          label: 'find',
          callback: this.clickedAdd
        }
      ]
    }

    // <div className="goal-decisions__buttons">
    //   {this.renderAddButton()}
    //   {this.renderSubmit()}
    // </div>

    return (
      <div className="goal-decisions">
        {this.renderCardLists()}
        <GoalStepAction data={goalAction}/>
      </div>
    )
  }
}
export default Collection

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Collection.propTypes = {
}
