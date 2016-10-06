import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Toast from '../components/toasty/Toast'
import '../components/toasty/styles/toasty.scss'

class Toasty extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  renderToasts(){
    const { toasts } = this.props;
    return toasts.map( (toast, i) => {
      return <Toast data={toast.toJS()} key={'toast-' + toast.get('id')}/>
    })

  }
  render() {
    return (
      <ReactCSSTransitionGroup transitionName="fadeToaster" component="div" className="toasty" transitionEnterTimeout={300} transitionLeaveTimeout={600}>
        {this.renderToasts()}
      </ReactCSSTransitionGroup>
    )
  }
}

function mapStateToProps(state) {
  return {
    toasts: state.get('toasty').toArray()
  }
}

const ConnectedToasty = connect(mapStateToProps, {
})(Toasty)
export default ConnectedToasty
