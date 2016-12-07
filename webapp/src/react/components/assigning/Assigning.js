import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import { map, mapContains, listOf } from 'react-immutable-proptypes';
import Icon from 'Icon';

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
    const { editable, onClick } = this.props;
    e.stopPropagation();
    if (editable && onClick) {
      onClick(e);
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

    if (!assignees || assignees.size < 1 && editable) {
      return this.renderAddAssignees();
    }

    let profileImage = '';
    assignees.forEach((assignee) => {
      const pic = assignee.get('profile_pic');
      if (pic) {
        profileImage = pic;
        if (me.get('id') === assignee.get('id')) {
          return false;
        }
      }
      return true;
    });

    if (!profileImage.length) {
      return this.renderIcon('PersonIcon');
    }

    return <img className="sw-assign__profile-image" src={profileImage} role="presentation" />;
  }
  renderOverlay() {
    const { assignees } = this.props;

    if (!assignees || assignees.size < 2) {
      return undefined;
    }

    return (
      <div className="sw-assign__overlay">{`+${assignees.size - 1}`}</div>
    );
  }
  renderTooltip() {
    const { assignees } = this.props;
    let tooltip;

    if (assignees.size < 1) {
      tooltip = <div className="sw-assign__name">No one is assigned</div>;
    } else {
      tooltip = assignees.map((assignee, i) => <div className="sw-assign__name" key={`assignee-${i}`}>{assignee.get('name')}</div>);
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
  assignees: listOf(mapContains({
    name: string,
    profile_pic: string,
  })),
  editable: bool,
  onClick: func,
  me: map,
};
