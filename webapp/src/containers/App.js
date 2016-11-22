import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api } from '../actions'

import Topbar from './Topbar'
import Modal from './Modal'
import Goals from './Goals'
import Overlay from './Overlay'
import Toasty from '../components/toasty/HOCToasty'


let DevTools = 'div';
if(process.env.NODE_ENV !== 'production'){
  DevTools = require('../DevTools');
}
import PureRenderMixin from 'react-addons-pure-render-mixin';

class App extends Component {
  constructor(props){
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.props.request('rtm.start');

    // Massive hack to not be able to drop files into swipes so it wouldn't redirect

    document.addEventListener('dragover', (e) => {
      e.preventDefault()
      return false;
    })

    document.addEventListener('drop', (e) => {
      e.preventDefault()
      return false;
    })
  }
  render() {
    let classes = 'main ';
    if(this.props.mainClasses){
      classes += this.props.mainClasses.toArray().join(' ');
    }
    return (
      <div className={classes}>
        <Topbar pathname={this.props.location.pathname} />
        <Goals />
        <Overlay />
        <Modal />
        <Toasty />
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mainClasses: state.getIn(['main', 'mainClasses'])
  }
}

const ConnectedApp = connect(mapStateToProps, {
  request: api.request
})(App)
export default ConnectedApp
