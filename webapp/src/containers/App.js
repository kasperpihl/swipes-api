import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api } from '../actions'

import Topbar from './Topbar'
import Find from './Find'
import Modal from './Modal'
import DotDragOverlay from './DotDragOverlay'

class App extends Component {
  componentDidMount() {
    this.props.request('rtm.start');
  }
  render() {
    let classes = 'main ' + this.props.mainClasses.join(' ');

    return (
      <div className={classes}>
        <Topbar />
        <div className="active-app">
          {this.props.children}
        </div>
        <Find />
        <Modal />
        <DotDragOverlay />
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