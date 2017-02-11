import React, { Component, PropTypes } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';

import './styles/handoff-header.scss';

class HandoffHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    const { onChangeClick } = this.props;
    onChangeClick('step', e);
  }
  clickedAssign(id, e) {
    const { onChangeClick } = this.props;
    onChangeClick(id, e);
  }
  renderAssignees(assignees, id) {
    return (
      <div className="handoff-header__assignees">
        <HOCAssigning index={id} assignees={assignees} maxImages={1} delegate={this} />
      </div>
    );
  }
  renderFrom() {
    const { from, isHandingOff } = this.props;

    let className = 'handoff-header__section handoff-header__section--left';

    if (isHandingOff) {
      className += ' handoff-header__section--active-left';
    }

    return (
      <div className={className}>
        <div className="handoff-header__top">
          <div className="handoff-header__title">{from.title}</div>
          {this.renderAssignees(from.assignees, 'from')}
        </div>
        <div className="handoff-header__subtitle">{from.subtitle}</div>
        <div className="handoff-header__seperator" />
      </div>
    );
  }
  renderCompletion() {
    const { isHandingOff } = this.props;

    let className = 'handoff-header__section handoff-header__section--right handoff-header__section--complete';

    if (isHandingOff) {
      className += ' handoff-header__section--active-right';
    }

    return (
      <div className={className}>
        <div className="handoff-header__top">
          <div className="handoff-header__icon">
            <Icon svg="Checkmark" className="handoff-header__svg" />
          </div>
          <div onClick={this.handleClick} className="handoff-header__title">Complete goal</div>
        </div>
      </div>
    );
  }
  renderTo() {
    const { to, isHandingOff } = this.props;

    if (!to) {
      return this.renderCompletion();
    }

    let className = 'handoff-header__section handoff-header__section--right';

    if (isHandingOff) {
      className += ' handoff-header__section--active-right';
    }

    return (
      <div className={className}>
        <div className="handoff-header__top">
          <div onClick={this.handleClick} className="handoff-header__title">{to.title}</div>
          {this.renderAssignees(to.assignees, 'to')}
        </div>
        <div className="handoff-header__subtitle">{to.subtitle}</div>
      </div>
    );
  }
  render() {
    return (
      <div className="handoff-header">
        {this.renderFrom()}
        {this.renderTo()}
      </div>
    );
  }
}

export default HandoffHeader;

const { shape, func, string, array, bool } = PropTypes;

HandoffHeader.propTypes = {
  from: shape({
    title: string,
    subtitle: string,
    assignees: array,
  }),
  to: shape({
    title: string,
    subtitle: string,
    assignees: array,
  }),
  isHandingOff: bool,
  onChangeClick: func.isRequired,
};
