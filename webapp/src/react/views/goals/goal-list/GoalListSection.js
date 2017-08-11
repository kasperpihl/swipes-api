import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/goal-list-section.scss';

class GoalListSection extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLinkClick')
  }
  componentDidMount() {
  }
  renderLeftSide() {
    const { icon, title } = this.props;

    return (
      <div className="goal-list-section__side">
        <Icon className="goal-list-section__mini-svg" icon={icon} />
        <div className="goal-list-section__title">
          {title}
        </div>
      </div>
    )
  }
  renderGoals() {
    const { children } = this.props;

    return (
      <div className="goal-list-section__children">
        {children}
      </div>
    )
  }
  render() {
    return (
      <div className="goal-list-section">
        <div className="goal-list-section__header">
          {this.renderLeftSide()}
        </div>
        {this.renderGoals()}
      </div>
    )
  }
}

export default GoalListSection
// const { string } = PropTypes;
GoalListSection.propTypes = {};