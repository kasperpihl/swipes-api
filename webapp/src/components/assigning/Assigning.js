import React, { Component, PropTypes } from 'react';
import { bindAll } from '../../classes/utils';
import Icon from '../icons/Icon';

import './styles/assigning.scss';

class Assigning extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['handleClick']);
  }
  componentDidMount() {
  }
  handleClick(e) {
    const { editable, clickAssign } = this.props;

    if (editable && clickAssign) {
      clickAssign(e);
    }
  }
  renderIcon(icon) {
    return <Icon svg={icon} className="sw-assign__icon" />;
  }
  renderAddAssignees() {
    return (
      <div className="sw-assign__assign">
        {this.renderIcon('AssignIcon')}
      </div>
    );
  }
  renderAssignees() {
    const { assignees, me, editable } = this.props;
    let profileImage = '';

    if (assignees.length < 1 && editable) {
      return this.renderAddAssignees();
    }

    for (let i = 0; i < assignees.length; i += 1) {
      if (assignees[i].profile_pic) {
        profileImage = assignees[i].profile_pic;
      }
      if (me && assignees[i].id === me.id) {
        profileImage = assignees[i].profile_pic;

        break;
      }
    }

    if (!profileImage.length) {
      return this.renderIcon('PersonIcon');
    }

    return <img className="sw-assign__profile-image" src={profileImage} role="presentation" />;
  }
  renderOverlay() {
    const { assignees } = this.props;

    if (assignees.length < 2) {
      return undefined;
    }

    return (
      <div className="sw-assign__overlay">{`+${assignees.length - 1}`}</div>
    );
  }
  renderTooltip() {
    const { assignees } = this.props;
    let tooltip;

    if (assignees.length < 1) {
      tooltip = <div className="sw-assign__name">No one is assigned</div>;
    } else {
      tooltip = assignees.map((assignee, i) => <div className="sw-assign__name" key={`assignee-${i}`}>{assignee.name}</div>);
    }

    return (
      <div className="sw-assign__tooltip" >
        {tooltip}
      </div>
    );
  }
  render() {
    return (
      <div className="sw-assign" onClick={this.handleClick}>
        {this.renderAssignees()}
        {this.renderOverlay()}
        {this.renderTooltip()}
      </div>
    );
  }
}

export default Assigning;

const { string, bool, arrayOf, shape, object, func } = PropTypes;

Assigning.propTypes = {
  assignees: arrayOf(shape({
    name: string,
    profile_pic: string,
  })),
  editable: bool,
  clickAssign: func,
  me: object,
};
