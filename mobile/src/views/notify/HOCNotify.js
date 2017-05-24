import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notify from './Notify';

class HOCNotify extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  attachmentPress(att) {
    console.log('att', att);
  }
  render() {
    const { me, goal } = this.props;

    return <Notify me={me} goal={goal} delegate={this} />
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.getIn(['goals', ownProps.goalId]),
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCNotify);
