import React, { Component, PropTypes } from 'react';

import './styles/assignee-tooltip.scss';

class AssigneeTooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderProfilePic(person) {
    const pic = person.get('profile_pic');

    if (pic) {
      return (
        <div className="tooltip__image">
          <img src={pic} alt="" />
        </div>
      );
    } else {
      const firstLetter = person.get('first_name').charAt(0);

      return <div className="tooltip__initial">{firstLetter}</div>;
    }
  }
  renderPeople() {
    const { assignees } = this.props;

    return assignees.map((a, i) => (
      <div className="tooltip__item" key={i}>
        {this.renderProfilePic(a)}
        <div className="tooltip__name">
          {a.get('first_name')} {a.get('last_name')}
        </div>
      </div>
      ));
  }
  render() {
    return (
      <div className="tooltip">
        {this.renderPeople()}
      </div>
    );
  }
}

export default AssigneeTooltip;
