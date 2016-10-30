import React, { Component, PropTypes } from 'react'
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
  render() {
    return (
      <div className="goal-decisions">
        <div className="goal-decisions__text">Are these designs good enough to move on?</div>
        <div className="goal-decisions__buttons">
          <Button icon="thumb_up" callback={this.decideYes} />
          <Button icon="thumb_down" style={{marginLeft: '15px'}} callback={this.decideNo} />
        </div>
      </div>
    )
  }
}
export default Decision

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Decision.propTypes = {

}
