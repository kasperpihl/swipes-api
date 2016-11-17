import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils'
import * as Icons from '../icons'

import './styles/assigning.scss'

class Assigning extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll(this, ['handleClick']);
  }
  componentDidMount() {
  }
  handleClick(e) {
    const { editable, clickAssign } = this.props;
    if (editable && clickAssign) {
      clickAssign(e)
    }
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="sw-assign__icon"/>;
    }
  }
  renderAddAssignees() {

    return (
      <div className="sw-assign__assign">
        {this.renderIcon('AssignIcon')}
      </div>
    )
  }
  renderAssignees() {
    const { assignees, me, editable } = this.props;
    let profileImage = '';
    let assigneesLength = 0;

    if (assignees.length < 1 && editable) {
      return this.renderAddAssignees()
    } else {

      for (let i = 0; i < assignees.length; i++) {
        if (assignees[i].profile_pic) {
          profileImage = assignees[i].profile_pic;
        }
        if (me && assignees[i].id === me.id) {
          profileImage = me.profile_pic;

          break;
        }
      }
    }

    if (!profileImage.length) {
      return this.renderIcon('PersonIcon')
    } else {
      return <img className="sw-assign__profile-image" src={profileImage} />
    }
  }
  renderOverlay() {
    const { assignees } = this.props;

    if (assignees.length < 2) {
      return;
    }

    return (
      <div className="sw-assign__overlay">{`+${assignees.length}`}</div>
    )
  }
  renderTooltip() {
    const { assignees } = this.props;
    let tooltip;

    if (assignees.length < 1) {
      tooltip = <div className="sw-assign__name">No one is assigned</div>
    } else {
      tooltip = assignees.map( (assignee, i) => {
        return <div className="sw-assign__name" key={`assignee-${i}`}>{assignee.name}</div>
      })
    }

    return (
      <div className="sw-assign__tooltip" >
        {tooltip}
      </div>
    )
  }
  render() {

    return (
      <div className="sw-assign" onClick={this.handleClick}>
        {this.renderAssignees()}
        {this.renderOverlay()}
        {this.renderTooltip()}
      </div>
    )
  }
}

export default Assigning

const { string, bool, arrayOf, shape } = PropTypes;

Assigning.propTypes = {
  assignees: arrayOf(shape({
    name: string,
    profile_pic: string
  })),
  editable: bool
}
