import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/milestone-result.scss';

class MilestoneResult extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLinkClick')
  }
  componentDidMount() {
  }
  render() {
    const { result } = this.props;

    return (
      <div className="milestone-result">
        <div className="milestone-result__icon">
          <Icon icon="MiniMilestone" className="milestone-result__svg" />
        </div>
        <div className="milestone-result__title">{result.item.title}</div>
      </div>
    )
  }
}

export default MilestoneResult
// const { string } = PropTypes;
MilestoneResult.propTypes = {};