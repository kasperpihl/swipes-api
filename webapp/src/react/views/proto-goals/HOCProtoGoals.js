import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';


class HOCProtoGoals extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="className">Yo</div>
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
})(HOCProtoGoals);
