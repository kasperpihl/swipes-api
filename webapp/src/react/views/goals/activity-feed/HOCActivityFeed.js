import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import * as a from 'actions';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import ActivityFeed from './ActivityFeed';

class HOCActivityFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    const { goal, navPop } = this.props;
    const nextGoal = nextProps.goal;
    if (goal && !nextGoal) {
      navPop();
    }
  }
  onClickAttachment(hI, i) {
    const { goal, preview } = this.props;
    const history = goal.get('history').reverse();
    const flag = history.getIn([hI, 'flags', i]);
    const att = goal.getIn(['attachments', flag]);
    const selection = window.getSelection();

    if (att && selection.toString().length === 0) {
      window.analytics.sendEvent('Flag opened', {
        From: 'Activity Feed',
        Type: att.getIn(['link', 'service', 'type']),
        Service: att.getIn(['link', 'service', 'name']),
      });
      preview(this.context.target, att);
    }
  }
  onClickURL(nI, url) {
    const { target, browser } = this.props;
    browser(target, url);
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }

  renderHeader() {
    return (
      <HOCHeaderTitle title="Activity feed" />
    );
  }
  render() {
    const { goal } = this.props;
    return (
      <SWView header={this.renderHeader()}>
        <ActivityFeed
          delegate={this}
          goal={goal}
        />
      </SWView>
    );
  }
}
// const { string } = PropTypes;

HOCActivityFeed.propTypes = {
  goal: map,
};

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
  browser: a.main.browser,
})(HOCActivityFeed);
