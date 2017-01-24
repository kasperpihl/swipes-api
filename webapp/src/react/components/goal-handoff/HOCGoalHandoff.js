import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';

import HandoffHeader from './HandoffHeader';
import HandoffMessage from './HandoffMessage';
import HandoffActions from './HandoffActions';

import './styles/goal-handoff.scss';

class HOCGoalHandoff extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
    bindAll(this, ['onHandoffChange']);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  onChangeClick(e) {

  }
  toggleActive() {
    this.setState({});
  }
  componentDidMount() {
  }
  onHandoffChange(text) {
    this.setState({ message: text });
  }
  mapStepToHeader(step, subtitle, index) {
    if (!step) {
      return undefined;
    }
    return {
      title: `${index}. ${step.get('title')}`,
      subtitle,
      assignees: step.get('assignees').toJS(),
    };
  }
  render() {
    const { message } = this.state;
    const helper = this.getHelper();
    const fromIndex = helper.getCurrentStepIndex();
    const from = this.mapStepToHeader(helper.getCurrentStep(), 'Current Step', fromIndex + 1);
    const to = this.mapStepToHeader(helper.getNextStep(), 'Next step', fromIndex + 2);

    return (
      <div className="goal-handoff">
        <HandoffHeader from={from} to={to} onChangeClick={this.onChangeClick} />
        <HandoffMessage text={message} onChange={this.onHandoffChange} />
        <HandoffActions />
      </div>
    );
  }
}
HOCGoalHandoff.propTypes = {
  goal: map,
  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  setStatus: actions.main.setStatus,
})(HOCGoalHandoff);
