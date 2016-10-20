import React, { Component, PropTypes } from 'react'
import * as Icons from '../../icons'
import Button from '../../swipes-ui/Button'
import { bindAll } from '../../../classes/utils'

import '../styles/form-decision.scss'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll( this, [ 'decideYes', 'decideNo' ]);
  }
  componentDidMount() {
  }
  renderIcon(icon, completed){
    const Comp = Icons[icon];
    let iconClass = 'form-decide__icon'

    if (completed === false) {
      iconClass += ' form-decide__icon--active'
    }

    if (Comp) {
      iconClass += ' form-decide__icon--svg'
      return <Comp className={iconClass}/>;
    } else {
      iconClass += ' form-decide__icon--font'
    }

    return <i className={"material-icons " + iconClass}>{icon}</i>
  }
  decide(yes){
    const { completeStep } = this.props;

    completeStep();
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
  renderHeader(icon, title, description, completed) {
    return (
      <div className="form-decide__header">
        {this.renderIcon(icon, completed)}
        <div className="form-decide__title">{title}</div>
        <div className="form-decide__description">{description}</div>
      </div>
    )
  }
  renderDecisionButton(){
    const { step } = this.props;
    if(step.get('completed')) return;
    return (
      <div className="goal-decisions" style={{marginTop: '60px'}}>
        <div className="goal-decisions__buttons">
          <Button icon="thumb_up" callback={this.decideYes} />
          <Button icon="thumb_down" style={{marginLeft: '15px'}} callback={this.decideNo} />
        </div>
      </div>
    )
  }
  render() {

    return (
      <div className="form-decide">
        {this.renderHeader('CheckmarkIcon', 'Purpose of meeting', 'Why should we have this meeting? What is the expected outcomes')}
        <div className="form-decide__response-wrap">
          <div className="form-decide__avatar">
            <img src="https://avatars.slack-edge.com/2016-10-07/88804920934_f6d899ac8257f186bfe5_192.jpg" alt=""/>
          </div>
          <div className="form-decide__response">When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you won&#39;t be the decision maker all the time, you can leave that field as to be left “blank”, meaning once created, the person can</div>
        </div>

        <div className="form-decide__response-wrap">
          <div className="form-decide__avatar">
            <img src="https://secure.gravatar.com/avatar/0abdbd665abf1b1ad3b64893fdc38f25.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0011-192.png" alt=""/>
          </div>
          <div className="form-decide__response">Brainstorm workflow ideas</div>
        </div>

        <div className="form-decide__response-wrap">
          <div className="form-decide__avatar">
            <img src="https://avatars.slack-edge.com/2015-02-08/3653274961_e603e2299019ffdacb4d_192.jpg" alt=""/>
          </div>
          <div className="form-decide__response">Brainstorm workflow ideas Lock down on 3 workflows</div>
        </div>

        {this.renderHeader('CheckmarkIcon', 'Schedule Time', 'Available times for this meeting')}
        <div className="form-decide__times">
          <div className="form-decide__available-time">
            <div className="form-decide__stats">5/5</div>
            <div className="form-decide__time">MON 10:00 AM</div>
          </div>

          <div className="form-decide__available-time">
            <div className="form-decide__stats">3/5</div>
            <div className="form-decide__time">WED 1:00 PM</div>
          </div>

          <div className="form-decide__available-time">
            <div className="form-decide__stats">2/5</div>
            <div className="form-decide__time">FRI 8:00 AM</div>
          </div>
        </div>

        {this.renderDecisionButton()}
        {this.renderHeader('ActionIcon', 'Automation', 'Create a cal event to all participants', false)}
      </div>
    )
  }
}

export default Form

const { string } = PropTypes;

Form.propTypes = {
  // removeThis: string.isRequired
}
