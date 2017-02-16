import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import SWView from 'SWView';

class HOCGoalHandoff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  getEmptyHandoff(target, message) {
    return fromJS({
      flags: [],
      assignees: null,
      message: message || '',
      target: target || this.calculateNextStep(),
    });
  }
  render() {
    return (
      <SWView>
        <div className="goal-handoff" />
      </SWView>
    );
  }
}
const { func } = PropTypes;

HOCGoalHandoff.propTypes = {
  goal: map,
  navPop: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCGoalHandoff);
