import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import MilestoneOverview from './MilestoneOverview';

class HOCMilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      tabs: ['Current', 'Completed'],
      goals: this.getFilteredGoals(props.milestone),
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      goals: this.getFilteredGoals(nextProps.milestone),
    })
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
  }
  getFilteredGoals(milestone) {
    return msgGen.milestones.getGoals(milestone);
  }
  getGoalListProps() {
    const { tabIndex, tabs } = this.state;
    return {
      delegate: this,
      tabIndex,
      tabs,
    }
  }
  render() {
    const { milestone } = this.props;
    const { goals, tabs, tabIndex } = this.state;

    return (
      <MilestoneOverview
        milestone={milestone}
        tabs={tabs}
        goals={goals}
        tabIndex={tabIndex}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCMilestoneOverview.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    goals: state.get('goals'),
    milestone: state.getIn(['milestones', ownProps.milestoneId]),
  };
}

export default connect(mapStateToProps, {
})(HOCMilestoneOverview);
