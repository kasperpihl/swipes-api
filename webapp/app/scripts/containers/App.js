import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api } from '../actions'

import Topbar from './Topbar'
import SearchResults from './SearchResults'
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
        <SearchResults />
        <Modal />
        <DotDragOverlay />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hasLoaded: state.main.hasLoaded,
    mainClasses: state.main.mainClasses || []
  }
}

const ConnectedApp = connect(mapStateToProps, {
  request: api.request
})(App)
export default ConnectedApp