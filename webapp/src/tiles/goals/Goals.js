import React, { Component, PropTypes } from 'react'
import SwipesCard from '../../components/swipes-card/SwipesCard'
import './goals.scss'
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
const initialData = [
  { title: 'Design icons' },
  { title: 'Investor presentation' },
  { title: 'Business model' }
]
class Goals extends Component {
  constructor(props) {
    super(props)
    this.state = {goals: initialData}
  }
  componentDidMount() {

  }
  clickedAddGoal(){
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