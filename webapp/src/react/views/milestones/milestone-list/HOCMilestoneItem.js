import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'react-delegate';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Icon from 'Icon';
import './styles/milestone-item.scss';

const PROGRESS_DASH = 320.4876403808594;

class HOCMilestoneItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      goals: this.getFilteredGoals(props.milestone),
    };
    setupDelegate(this, 'onOpenMilestone').setGlobals(props.milestone.get('id'));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      goals: this.getFilteredGoals(nextProps.milestone),
    });
  }
  getFilteredGoals(milestone) {
    return msgGen.milestones.getGoals(milestone);
  }
  renderHeader() {
    const { milestone } = this.props;

    return (
      <div className="header">
        <div className="header__left">
          <div className="header__title">{milestone.get('title')}</div>
        </div>
        <div className="header__icon">
          <Icon icon="ArrowRightLong" className="header__svg" />
        </div>
      </div>
    );
  }
  renderProgress() {
    const { milestone } = this.props;
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => new GoalsUtil(g).getIsCompleted()).size;
    const percentage = numberOfGoals ? parseInt((numberOfCompletedGoals / numberOfGoals) * 100, 10) : 0;
    const svgDashOffset = PROGRESS_DASH - ((PROGRESS_DASH * percentage) / 100);
    let progressClassName = 'milestone__svg milestone__svg--fg';

    if (milestone.get('closed_at')) {
      progressClassName += ' milestone__svg--closed';
    }

    return (
      <div className="milestone__progress">
        <div className="milestone__subtitle">{`${numberOfCompletedGoals} / ${numberOfGoals}`}</div>
        <Icon icon="MilestoneProgress" className="milestone__svg milestone__svg--bg" />
        <Icon
          icon="MilestoneProgress"
          className={progressClassName}
          strokeDasharray={PROGRESS_DASH}
          strokeDashoffset={svgDashOffset}
        />
        <div className="progress">
          <div className="progress__dot" />
          <div className="progress__number"></div>
        </div>
        <div className="progress-number">
          <div className="progress-number__number">{`${percentage}%`}</div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="milestone" onClick={this.onOpenMilestone}>
        {this.renderHeader()}
        {this.renderProgress()}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCMilestoneItem.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    goals: state.get('goals'),
  };
}

export default connect(mapStateToProps, {
})(HOCMilestoneItem);
