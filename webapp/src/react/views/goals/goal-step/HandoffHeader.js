import React, { Component, PropTypes } from 'react';
import HOCAssigning from 'components/assigning/HOCAssigning';
import { map } from 'react-immutable-proptypes';

import './styles/handoff-header.scss';

class HandoffHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    const { onChangeClick } = this.props;

    onChangeClick(e);
  }
  renderFrom() {
    const { from } = this.props;

    return (
      <div className="handoff-header__section handoff-header__section--left">
        <div className="handoff-header__top">
          <div className="handoff-header__title">{from.title}</div>
          <div className="handoff-header__assignees">
            <HOCAssigning assignees={from.assignees} />
          </div>
        </div>
        <div className="handoff-header__subtitle">{from.subtitle}</div>
      </div>
    );
  }
  renderTo() {
    const { to } = this.props;

    if (!to) {
      return undefined;
    }

    return (
      <div className="handoff-header__section handoff-header__section--right">
        <div className="handoff-header__top">
          <div className="handoff-header__title">{to.title}</div>
          <button className="handoff-header__button" onClick={this.handleClick}>change</button>
          <div className="handoff-header__assignees">
            <HOCAssigning assignees={to.assignees} />
          </div>
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

const { shape, func, string, array } = PropTypes;

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
  onChangeClick: func.isRequired,
};
