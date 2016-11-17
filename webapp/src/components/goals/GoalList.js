import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'

import GoalListItem from './GoalListItem'
import TagItem from '../tags/TagItem';

import './styles/goals-list.scss'

class GoalList extends Component {
  constructor(props) {
    super(props)
    this.tags = [
      'development',
      'design',
      'v1',
      'beta',
      'bugs',
      'marketing',
      'sales',
      'vacation',
      'team building'
    ];
    bindAll(this, ['clickedListItem']);
  }
  componentDidMount() {
  }
  clickedListItem(id){
    this.props.setActiveGoal(id);
  }


  renderList() {
    let { goals, tabIndex } = this.props;

    goals = goals.sort((a, b) => b.get('timestamp').localeCompare(a.get('timestamp'))).toArray();
    goals = this.filterGoals(goals);

    return goals.map((goal) => {
      return <GoalListItem onClick={this.clickedListItem} me={this.props.me} data={goal} key={'goal-list-item-' + goal.get('id')}/>
    })
  }
  renderTagsList() {
    return;
    const { tabIndex } = this.props;
    let items = [];

    items = this.tags.map((tag, i) => {
      return <TagItem text={tag} key={'tag-item-' + i} />
    })

    if (tabIndex === 2) {
      return (
        <div className="goals__tags">{items}</div>
      )
    }
  }
  render() {
    return (
      <div className="goals-list">
        {this.renderList()}
        {this.renderTagsList()}
      </div>
    )
  }



  filterGoals(goals){
    const { tabIndex } = this.props;

    switch(tabIndex){
      case 0:
        return this.filterMine(goals);
      case 1:
        return this.filterLater(goals);
      case 2:
        return this.filterCompleted(goals);
      case 3:
        return goals;
      default:
        return this.filterMine(goals);
    }
  }
  filterCompleted(goals){
    return goals.filter((goal) => {
      return (goal.get('steps').last().get('completed'))
    })
  }
  filterMine(goals) {
    const {
      me
    } = this.props;

    return goals.filter((goal) => {
      const steps = goal.get('steps');
      const currentStep = steps.find((step) => {
        return step.get('completed') !== true;
      })

      if (!currentStep) {
        return false;
      }

      const assignees = currentStep.get('assignees');
      const containsMe = assignees.find((user) => {
        if (user.get('id') === me.get('id')) {
          return true;
        }

        return false;
      })

      if (!containsMe) {
        return false;
      }

      return true;
    })
  }
  filterLater(goals) {
    const {
      me
    } = this.props;

    return goals.filter((goal) => {
      const steps = goal.get('steps');
      let indexCompleted = null;
      let match = null;

      const currentStep = steps.findEntry((step) => {
        return step.get('completed') !== true;
      })

      if (!currentStep) {
        return false;
      }

      indexCompleted = currentStep[0];

      steps.forEach((step, i) => {
        if (i > indexCompleted) {
          const assignees = step.get('assignees');
          const containsMe = assignees.find((user) => {
            if (user.get('id') === me.get('id')) {
              return true;
            }

            return false;
          })

          if (containsMe) {
            match = true;
            // Stop the forEach
            return false;
          }
        }
      })

      if (match) {
        return true;
      }

      return false;
    })
  }
}

export default GoalList
