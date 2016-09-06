import React, { Component, PropTypes } from 'react'
import SwipesCard from '../../components/swipes-card/SwipesCard'
import './goals.scss'
import { bindAll } from '../../classes/utils'
import GoalsModel from './goals-model'

const goalData = {
  title: "Design Icons",
  description: "Get the final versions of the",
  steps: [{
    type: 'work',
    subtype: 'select-work',
    settings: {
      multiple: true,
      limit: 5
    }
  },{
    type: 'decision'
  }]
}
class Goals extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['update', 'clickedAddGoal'])
    this.model = new GoalsModel(this.update);
    this.state = {goals: []}
  }
  update(goals){
    this.setState({ goals })
  }
  componentDidMount() {

  }
  clickedAddGoal(){
    const { swipes } = this.props;
    swipes.modal('list', {title: 'Select Template', rows: [
      { id: 'design', name: 'Design' },
      { id: 'file', name: 'File Vacation' },
      { id: 'develop', name: 'Feature' }
    ]}, (res) => {
      console.log('modal done', res);
      if(res){
        const id = this.model.add({title: res.name})
        console.log('id received', id);
      }
    });
    console.log('adding new goal'); 
  }
  renderGoals(){
    return this.state.goals.map((g, i) => {
      return <SwipesCard key={"goal-" + i} data={g} />
    })
  }
  renderNewGoal(){
    return <div className="add-new-goal" onClick={this.clickedAddGoal}>New Goal</div>
  }
  render() {
    return (
      <div className="goals-container">
        <div className="goals-wrapper">
          {this.renderGoals()}
          {this.renderNewGoal()}
        </div>
      </div>
    )
  }
}
export default Goals

Goals.propTypes = {
  
}