import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Toast from './Toast';

import './styles/toasty.scss';

class HOCToasty extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  renderToasts() {
    const { toasts } = this.props;
    return toasts.map(toast => <Toast data={toast.toJS()} key={`toast-${toast.get('id')}`} />);
  }
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="fadeToaster"
        component="div"
        className="toasty"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={600}
      >
        {this.renderToasts()}
      </ReactCSSTransitionGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    toasts: state.get('toasty').toArray(),
  };
}

const { array } = PropTypes;

HOCToasty.propTypes = {
  toasts: array,
};

const ConnectedHOCToasty = connect(mapStateToProps, {
})(HOCToasty);
export default ConnectedHOCToasty;
