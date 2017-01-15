import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';

import './styles/completed';

class HOCCompleted extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.timeout = setTimeout(() => {
      const { overlay } = this.props;
      overlay(null); // close itself
    }, 5000);
  }
  componentWillUnmount() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
    if (this.timeout) {
      // make sure we don't remove another overlay if we're offscreen.
      clearTimeout(this.timeout);
    }
  }
  render() {
    return (
      <div className="completed-overlay">
        <Icon svg="Star" className="completed__icon" />
        <div className="completed__header completed__header--sub">Nice work!</div>
        <div className="completed__header completed__header--main">step completed</div>
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
  overlay: actions.main.overlay,
})(HOCCompleted);
