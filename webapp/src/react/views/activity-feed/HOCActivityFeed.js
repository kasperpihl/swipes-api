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
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  onClickAttachment(hI, i) {
    const { goal, preview } = this.props;
    const history = goal.get('history').reverse();
    const flag = history.getIn([hI, 'flags', i]);
    const att = goal.getIn(['attachments', flag]);
    const selection = window.getSelection();

    if (att && selection.toString().length === 0) {
      preview(this.context.target, att);
    }
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
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
})(HOCActivityFeed);
