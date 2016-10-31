import React, { Component, PropTypes } from 'react'
import { List, fromJS } from 'immutable'
import SwipesCardList from '../../swipes-card/SwipesCardList'
import GoalStepAction from '../GoalStepAction'
import Button from '../../swipes-ui/Button'
import { bindAll } from '../../../classes/utils'

import '../styles/decisions.scss'

class Decision extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll( this, [ 'decideYes', 'decideNo' ]);
  }
  handleClick() {
    console.log('clicked decision');
  }
  findCollectionsFromPreviousSteps() {
    const { goal, step } = this.props;
    const currentInterationIndex = step.getIn(['data', 'iterations']).size - 1;
    let iterations = new List();
    let foundStep = false;

    goal.get('steps').forEach((s) => {
      if (foundStep) {
        return;
      }

      if (s.get('type') === 'decide' && s.get('id') !== step.get('id')) {
        iterations.clear();
      }

      if (s.get('type') === 'deliver' && s.get('subtype') === 'collection') {
        s.getIn(['data', 'iterations']).forEach((iteration, i) => {
          const deliverables = iteration.get('collection');

          iterations = iterations.update(i, (item) => {
            if (!item) {
              return deliverables;
            }

            return item.toSet().union(deliverables.toSet()).toList();
          })
        })
      }

      if (s.get('id') === step.get('id')) {
        foundStep = true;
      }
    })

    return iterations;
  }
  decide(yes){
    const decision = (yes);
    const { swipes, goal } = this.props;
    swipes.do({action: 'decide', 'goal_id': goal.get('id'), payload: {decision}}).then((res, err) => {
      console.log('ret', res, err);
    })
  }
  decideYes(){
    this.decide(true);
  }
  decideNo(){
    const { swipes } = this.props;
    swipes.modal('SwipesModal', {
      title: 'Why not?',
      data: {
        textarea: 'Please give as good feedback as possible.',
        buttons: ['Send']
      }
    }, (res) => {
      if(res && res.text && res.text.length){
        swipes.sendEvent('send.slackMessage', {text: res.text});
      }
      console.log(res);
    })
  }
  renderCardLists() {
    const { step, cardDelegate } = this.props;
    const iterations = this.findCollectionsFromPreviousSteps();

    const cards = iterations.toArray().map((iteration, i) => {
      return {
        title: 'v' + (i+1),
        items: iteration.toArray().map((item) => {
          return { shortUrl: item.get('url') };
        })
      }
    })

    return <SwipesCardList delegate={cardDelegate} data={cards} key={"decision-cardlist"}/>;
  }
  render() {
    const goalAction = {
      title: 'Proceed with these designs?',
      icon: 'VoteIcon',
      buttons: [
        {
          label: 'Yes',
          callback: this.decideYes
        },
        {
          label: 'No',
          callback: this.decideNo
        }
      ]
    };

    return (
        <div className="goal-decisions">
          {this.renderCardLists()}
          <GoalStepAction data={goalAction}/>
        </div>
    )
  }
}

export default Decision

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Decision.propTypes = {}
