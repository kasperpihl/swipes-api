import React, { Component, PropTypes } from 'react'
import * as Icons from '../../icons'

import '../styles/form-decision.scss'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {}
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
  renderHeader(icon, title, description, completed) {
    return (
      <div className="form-decide__header">
        {this.renderIcon(icon, completed)}
        <div className="form-decide__title">{title}</div>
        <div className="form-decide__description">{description}</div>
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
            <img src="https://avatars.slack-edge.com/2016-10-07/88804920934_f6d899ac8257f186bfe5_192.jpg" alt=""/>
          </div>
          <div className="form-decide__response">Brainstorm workflow ideas</div>
        </div>

        <div className="form-decide__response-wrap">
          <div className="form-decide__avatar">
            <img src="https://avatars.slack-edge.com/2016-10-07/88804920934_f6d899ac8257f186bfe5_192.jpg" alt=""/>
          </div>
          <div className="form-decide__response">Brainstorm workflow ideas Lock down on 3 workflows</div>
        </div>

        {this.renderHeader('CheckmarkIcon', 'Schedule Time', 'Available times for this meeting')}

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
