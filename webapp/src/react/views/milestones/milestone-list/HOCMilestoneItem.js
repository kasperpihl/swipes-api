import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'swipes-core-js/classes/utils';
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
    setupDelegate(this, props.milestone.get('id'));
    this.callDelegate.bindAll('onOpenMilestone');
  }
  componentDidMount() {
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
    const { goals } = this.state;
    const numberOfGoals = goals.size;
    const numberOfCompletedGoals = goals.filter(g => g.getIn(['status', 'completed'])).size;

    const percentage = numberOfGoals ? parseInt((numberOfCompletedGoals / numberOfGoals) * 100, 10) : 0;

    const svgDashOffset = PROGRESS_DASH - ((PROGRESS_DASH * percentage) / 100);

    return (
      <div className="milestone__progress">
        <div className="milestone__subtitle">{`${numberOfCompletedGoals} / ${numberOfGoals}`}</div>
        <Icon icon="MilestoneProgress" className="milestone__svg milestone__svg--bg" />
        <Icon
          icon="MilestoneProgress"
          className="milestone__svg milestone__svg--fg"
          strokeDasharray={PROGRESS_DASH}
          strokeDashoffset={svgDashOffset}
        />
        <div className="progress">
          <div className="progress__dot" />
          <div className="progress__number">{`${percentage}%`}</div>
        </div>
      </div>
    );
  }
  renderLastActivity() {
    const { goals } = this.state;
    let lastActivity;
    let goalId;

    goals.forEach((g) => {
      const helper = new GoalsUtil(g);
      const last = helper.getLastActivity();
      if (!lastActivity || last.get('done_at') > lastActivity.get('done_at')) {
        lastActivity = last;
        goalId = helper.getId();
      }
    });

    const userId = lastActivity && lastActivity.get('done_by');

    console.log('userId', userId);

    return (
      <div className="last-activity">
        <div className="last-activity__left">
          {
            userId ? (
              <HOCAssigning assignees={[userId]} />
            ) : (
              undefined
            )
          }
        </div>
        <div className="last-activity__right">
          <div className="last-activity__name">Kasper</div>
          <div className="last-activity__label">completed goal “Notifications”</div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="milestone" onClick={this.onOpenMilestone}>
        <div className="milestone__seperator" />
        {this.renderHeader()}
        {this.renderProgress()}
        {this.renderLastActivity()}
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
