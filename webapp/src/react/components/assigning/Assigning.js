import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindAll, getParentByClass } from 'swipes-core-js/classes/utils';
import { map, mapContains, listOf } from 'react-immutable-proptypes';
import Icon from 'Icon';
import AssigneeTooltip from './AssigneeTooltip';

import './styles/assigning.scss';

class Assigning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxImages: props.maxImages || 3,
      showTooltip: true,
    };
    bindAll(this, ['onClick', 'onMouseEnter', 'onMouseLeave']);
  }
  componentDidMount() {
    const { size } = this.props;
    const assigning = this.refs.assigning;

    if (assigning.classList.contains('assignees--custom-size')) {
      assigning.style.setProperty('--assigneesSize', `${size}px`);
    }
  }
  onClick(e) {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  }
  onMouseEnter(e) {
    const target = getParentByClass(e.target, 'assignees');
    const { tooltip, assignees, tooltipAlign } = this.props;
    const position = tooltipAlign || 'right';

    const data = {
      component: AssigneeTooltip,
      props: {
        assignees,
      },
      options: {
        boundingRect: target.getBoundingClientRect(),
        position,
      },
    };

    tooltip(data);
  }
  onMouseLeave() {
    const { tooltip } = this.props;

    tooltip(null);
  }
  renderIcon(icon) {
    return <Icon icon={icon} className="assignees__icon" />;
  }
  renderAddAssignees() {
    return (
      <div className="assignees__assign">
        {this.renderIcon('Person')}
      </div>
    );
  }
  renderAssignees() {
    const { assignees } = this.props;
    const { maxImages } = this.state;
    if (!assignees || assignees.size < 1) {
      return this.renderAddAssignees();
    }

    const renderPeople = assignees.map((a, i) => {
      const pic = msgGen.users.getPhoto(a);
      const firstLetter = msgGen.users.getInitials(a);

      if (i < maxImages || (i === maxImages && assignees.size === (maxImages + 1))) {
        if (pic) {
          return (
            <div className="assignees__profile assignees__profile--image" key={a.get('id')}>
              <img src={pic} alt="" />
            </div>
          );
        }
        return (
          <div className="assignees__profile assignees__profile--name" key={a.get('id')}>
            {firstLetter}
          </div>
        );
      }
      return undefined;
    });

    let morePeople;

    if (assignees.size > (maxImages + 1)) {
      morePeople = <div className="assignees__profile assignees__profile--more">{assignees.size - maxImages}</div>;
    }

    return (
      <div className="assignees__profiles">
        {morePeople}
        <div className="assignees__people">
          {renderPeople}
        </div>
      </div>
    );
  }
  render() {
    const { rounded, size } = this.props;
    let className = 'assignees';
    const styles = {};

    if (rounded) {
      className += ' assignees--rounded';
    }

    if (size) {
      className += ' assignees--custom-size';
    }

    return (
      <div
        className={className}
        onClick={this.onClick}
        ref="assigning"
        data-assigning
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.renderAssignees()}
      </div>
    );
  }
}

export default Assigning;

const { string, func, number, bool } = PropTypes;

Assigning.propTypes = {
  assignees: listOf(mapContains({
    name: string,
    profile_pic: string,
  })),
  maxImages: number,
  onClick: func,
  rounded: bool,
  size: number,
  tooltip: func,
  tooltipAlign: string,
};
