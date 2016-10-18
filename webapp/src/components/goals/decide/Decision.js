import React, { Component, PropTypes } from 'react'
import Button from '../../swipes-ui/Button'
import { bindAll } from '../../../classes/utils'
import Form from './Form'

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
    this.decide();
  }
  render() {
    return (
      <Form />
    )
  }
}
export default Decision

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Decision.propTypes = {

}
