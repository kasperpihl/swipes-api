import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';

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
  componentDidMount() {
  }
  onHandoffChange(text) {
    this.setState({ message: text });
  }
  render() {
    const { message } = this.state;
    return (
      <div className="goal-handoff">
        <HandoffHeader />
        <HandoffMessage text={message} onChange={this.onHandoffChange} />
        <HandoffActions />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    main: state.get('main'),
  };
}

export default connect(mapStateToProps, {
  setStatus: actions.main.setStatus,
})(HOCGoalHandoff);
