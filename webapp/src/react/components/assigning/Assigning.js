import React, { Component, PropTypes } from 'react';
import { bindAll } from 'classes/utils';
import { map, mapContains, listOf } from 'react-immutable-proptypes';
import Icon from 'Icon';

import './styles/assigning.scss';

class Assigning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxImages: props.maxImages || 3,
    };
    bindAll(this, ['handleClick']);
  }
  componentDidMount() {
    const { size } = this.props;
    const assigning = this.refs.assigning;
    if (assigning.classList.contains('assignees--custom-size')) {
      assigning.style.setProperty('--assigneesSize', `${size}px`);
    }
  }
  handleClick(e) {
    const { onClick } = this.props;
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    }
  }
  renderIcon(icon) {
    return <Icon svg={icon} className="assignees__icon" />;
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
      const pic = a.get('profile_pic');
      const firstLetter = a.get('first_name').charAt(0);

      if (i < maxImages || (i === maxImages && assignees.size === (maxImages + 1))) {
        if (pic) {
          return (
            <div className="assignees__profile assignees__profile--image" key={i}>
              <img src={pic} alt="" />
            </div>
          );
        }
        return (
          <div className="assignees__profile assignees__profile--name" key={i}>
            {firstLetter}
          </div>
        );
      }
      return undefined;
    });

    let morePeople;

    if (assignees.size > (maxImages + 1)) {
      morePeople = <div className="assignees__profile assignees__profile--more">+{assignees.size - maxImages}</div>;
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
      <div className={className} onClick={this.handleClick} ref="assigning">
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
};
