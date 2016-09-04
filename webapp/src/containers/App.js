import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api } from '../actions'

import Topbar from './Topbar'
import Find from './Find'
import Modal from './Modal'
import DotDragOverlay from './DotDragOverlay'
let DevTools = 'div';
if(process.env.NODE_ENV !== 'production'){
  DevTools = require('../DevTools');
}

class App extends Component {
  componentDidMount() {
    this.props.request('rtm.start');
  }
  render() {
    let classes = 'main ' + this.props.mainClasses.join(' ');
    return (
      <div className={classes}>
        <Topbar pathname={this.props.location.pathname} />
        <div className="active-app">
          {this.props.children}
        </div>
        <Find />
        <Modal />
        <DotDragOverlay />
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mainClasses: state.main.mainClasses || []
  }
}

const ConnectedApp = connect(mapStateToProps, {
  request: api.request
})(App)
export default ConnectedApp
